# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# http://doc.scrapy.org/en/latest/topics/items.html

import scrapy

class AnimelistItem(scrapy.Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    a_episodes = scrapy.Field()
    a_title = scrapy.Field()
    a_rating = scrapy.Field()
    a_producer = scrapy.Field()
    a_broadcast = scrapy.Field()
    a_desc = scrapy.Field()
    a_start_date = scrapy.Field()
    a_genre = scrapy.Field()
    a_characters = scrapy.Field()
    a_type = scrapy.Field()
    a_duration = scrapy.Field()
    a_studio = scrapy.Field()
    a_end_date = scrapy.Field()
    a_status = scrapy.Field()
    a_licensor = scrapy.Field()
    a_score = scrapy.Field()
    FIELDS = ['a_episodes', 'a_title', 'a_rating', 'a_producer', 'a_broadcast', 'a_desc', 'a_aired', 'a_genre', 'a_characters', 'a_type', 'a_duration', 'a_studio', 'a_status', 'a_licensor', 'a_start_date', 'a_end_date', 'a_score']

class Time:
    """
    A simple time object to represent time
    """
    def __init__(self, timeString):
        self.h = ''
        self.m = ''
        timeList = timeString.split()[::-1]
        timeList = zip(*(iter(timeList),) * 2)
        for metric, time in timeList:
            if metric == 'min':
                self.m = time
            elif metric == 'hr':
                self.h = time

    def __repr__(self):
        return '\'{0}:{1}\''.format(self.h.zfill(2), self.m.zfill(2))
