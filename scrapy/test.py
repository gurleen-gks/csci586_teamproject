from scrapy.spider import Spider
from scrapy.selector import Selector
from animeList.items import AnimelistItem, Time
from datetime import datetime

# xpath: //*[@id="content"]/table/tr/td[1]/div/div[9]//text() 

class MySpider(Spider):
    name = "anime"
    allowed_domains = ["myanimelist.net"]
    with open('idList.txt') as fp:
        data = fp.readlines()
    with open('scraped.txt') as fp:
        scrapedURLs = set(map(str.strip, fp.readlines()))
    writeFile = open('scraped.txt', 'a')
    start_urls = list(map(lambda x: 'https://myanimelist.net/anime/' + x, data))
    custom_settings = {
        'CONCURRENT_REQUESTS_PER_DOMAIN': 1,
        'FEED_EXPORT_FIELDS': ['a_episodes', 'a_title', 'a_rating', 'a_producer', 'a_broadcast', 'a_desc', 'a_genre', 'a_characters', 'a_type', 'a_duration', 'a_studio', 'a_status', 'a_licensor', 'a_start_date', 'a_end_date', 'a_score'],
        'DOWNLOAD_DELAY': 1
    }
    

    def closed(self, reason):
        self.writeFile.close()

    def parse(self, response):
        if response.url[:-3] in self.scrapedURLs:
            return
        self.writeFile.write(response.url[:-3])
        self.writeFile.write('\n')
        self.writeFile.flush()
        self.scrapedURLs.add(response.url[:-3])
        item = AnimelistItem()
        hxs = Selector(response)
        data = []
        item['a_title'] = list(map(lambda x: x.replace(':', '').lower(), filter(None, map(str.strip, hxs.xpath('//*[@id="content"]/table/tr/td[1]/div/div[6]//text()').extract()))))[1]
        for i in range(9, 22):
            data += list(map(lambda x: x.replace(':', '').lower(), filter(None, map(str.strip, hxs.xpath('//*[@id="content"]/table/tr/td[1]/div/div[' + str(i) + ']//text()').extract())))),
        data += list(map(lambda x: x.replace(':', '').lower(), filter(None, map(str.strip, hxs.xpath('//*[@id="content"]/table/tr/td[1]/div/div[22]//text()').extract())))), 
        item['a_title'] = ' '.join(map(str.capitalize, item['a_title'].split()))
        desc = list(filter(None, filter(lambda x: x != ',', map(str.strip, hxs.xpath('//*[@id="content"]/table/tr/td[2]/div[1]/table/tr[1]/td/span//text()').extract()))))
        desc = ' '.join(desc).replace('"', '')
        item['a_desc'] = desc
        chars = hxs.xpath('//*[@id="content"]/table/tr/td[2]/div[1]/table/tr[2]/td/div[1]//text()').extract()
        chars = list(filter(None, map(str.strip, chars)))
        chars = chars[::2]
        charMap = {}
        for char, actor in zip(*(iter(chars),) * 2):
            charMap[char] = actor
        item['a_characters'] = charMap
        for x in data:
            name, val = x[0], x[1:]
            if name[-1] == 's' and name != 'status' and name != 'episodes':
                name = name[:-1]
            name = 'a_' + name
            if name not in AnimelistItem.FIELDS:
                continue
            elif name == 'a_duration':
                val = val[0].replace('per ep.', '').replace('.', '')
                item[name] = Time(val)
            elif name == 'a_producer':
                val = list(filter(lambda x: x != ',', val))
                item[name] = val
            elif name == 'a_genre':
                item[name] = list(filter(lambda x: x != ',', val))
            elif name == 'a_aired':
                if 'to' in val[0]:
                    start, end = map(str.strip, val[0].split('to'))
                    start, end = start.replace(',', ''), end.replace(',', '')
                    item['a_start_date'] = datetime.strptime(start, '%b %d %Y')
                    if end != '?':
                        item['a_end_date'] = datetime.strptime(end, '%b %d %Y')
                    else:
                        item['a_end_date'] = datetime(9999, 1, 1)
                else:
                    val = val[0].strip().replace(',', '')
                    item['a_start_date'] = datetime.strptime(val, '%b %d %Y')
                    item['a_end_date'] = datetime(9999, 1, 1)
            elif name == 'a_score':
                item[name] = float(val[0])
            else:
                item[name] = val[0]
        return [item]
