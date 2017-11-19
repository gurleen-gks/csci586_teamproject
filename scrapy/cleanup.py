import pandas as pd
import sys
import re

def hrToMin(x):
    hr, m = x[1:-1].split(':')
    return str((int(hr) * 60) + int(m))

pattern = re.compile('[^0-9a-zA-Z ]+')

def clean(df, col):
    df[col] = df[col].apply(lambda x: pattern.sub('', x))
    df[col] = df[col].str.strip()
    df = df[df[col] != '']
    return df

data = pd.read_csv('data.csv')
data['a_episodes'] = data['a_episodes'].str.replace('unknown', '0')
data['a_duration'] = data['a_duration'].apply(hrToMin)
data = data.reset_index()
data = data.rename(columns={'index': 'a_id'})
data = clean(data, 'a_title')
data = clean(data, 'a_rating')
data = data.dropna(subset=['a_broadcast'], how='any')
data['a_broadcast'] = data['a_broadcast'].str.replace('\(jst\)', '')
data['a_broadcast'] = data['a_broadcast'].str.replace('jst', '')
data['a_broadcast'] = data['a_broadcast'].str.replace('unknown', '')
data['a_broadcast'] = data['a_broadcast'].str.replace(' at ', ' ')
data['a_broadcast'] = data['a_broadcast'].str.strip()
data = clean(data, 'a_broadcast')

genreDf = data[['a_id', 'a_title', 'a_genre']]
genreDf = genreDf.apply(lambda x: pd.Series(map(str.strip, x['a_genre'].split(','))), axis=1).stack().reset_index(level=1, drop=1).to_frame('a_genre').join(genreDf[['a_id', 'a_title']])
genreDf.to_csv('newData/genre.csv', index=False)

producerDf = data[['a_id', 'a_title', 'a_producer']]
producerDf = producerDf.apply(lambda x: pd.Series(map(str.strip, x['a_producer'].split(','))), axis=1).stack().reset_index(level=1, drop=1).to_frame('a_producer').join(producerDf[['a_id', 'a_title']])
producerDf = producerDf[(producerDf['a_producer'] != '') & (producerDf['a_producer'] != 'none found') & (producerDf['a_producer'] != 'add some')]
producerDf = clean(producerDf, 'a_producer')
producerDf.to_csv('newData/producers.csv', index=False)

licensorDf = data[['a_id', 'a_title', 'a_licensor']]
licensorDf = licensorDf.apply(lambda x: pd.Series(map(str.strip, x['a_licensor'].split(','))), axis=1).stack().reset_index(level=1, drop=1).to_frame('a_licensor').join(licensorDf[['a_id', 'a_title']])
licensorDf = licensorDf[(licensorDf['a_licensor'] != '') & (licensorDf['a_licensor'] != 'none found')]
licensorDf = clean(licensorDf, 'a_licensor')
licensorDf.to_csv('newData/licensors.csv', index=False)

studioDf = data[['a_id', 'a_title', 'a_studio']]
studioDf = studioDf.apply(lambda x: pd.Series(map(str.strip, x['a_studio'].split(','))), axis=1).stack().reset_index(level=1, drop=1).to_frame('a_studio').join(studioDf[['a_id', 'a_title']])
studioDf = studioDf[(studioDf['a_studio'] != '') & (studioDf['a_studio'] != 'none found')]
studioDf = clean(studioDf, 'a_studio')
studioDf.to_csv('newData/studios.csv', index=False)

characterDf = data[['a_id', 'a_title', 'a_characters']]
characterDf['a_characters'] = characterDf['a_characters'].apply(eval)
characters = pd.DataFrame()
cols = ['a_id', 'a_title', 'a_character', 'a_actor']
for row in characterDf.itertuples():
    for key, val in row[3].items():
        cur = pd.DataFrame([[row[1], row[2], key, val]], columns=cols)
        characters = characters.append(cur)
characters = clean(characters, 'a_character')
characters = clean(characters, 'a_actor')
characters.to_csv('newData/characters.csv', index=False)

animeDf = data[['a_id', 'a_title', 'a_rating', 'a_desc', 'a_type', 'a_duration', 'a_status', 'a_start_date', 'a_end_date', 'a_score', 'a_episodes', 'a_broadcast']]
animeDf.to_csv('newData/anime.csv', index=False)

data2 = pd.read_csv('reviews.csv')
data2 = data2.rename(columns={'Anime Name ': 'a_title', ' Review Content': 'a_review', ' Review Page Link': 'r_link', ' Anime Link': 'a_link', ' User Link': 'u_link', ' Author': 'r_author', ' Time': 'r_time', ' story': 'r_story', ' animation': 'r_animation', ' sound': 'r_sound', ' characters': 'r_characters', ' overall': 'r_overall'})
data2['a_title'] = data2['a_title'].apply(lambda x: x.strip().replace('-', ' ').title())
data2 = data2.drop(['a_review'], axis=1)
data2 = data2.applymap(lambda x: x.strip() if type(x) is str else x)
data2 = clean(data2, 'a_title')
data2.to_csv('newData/reviews.csv', index=False)

data3 = pd.read_csv('userdatas.csv')
data3 = data3.rename(columns={'User Name ': 'u_name', ' User Link': 'u_link', ' User  Location': 'u_location', ' Joined': 'u_joined', ' Follow': 'u_follow', ' Gender': 'u_gender', ' Followers': 'u_followers', ' Following': 'u_following', ' Watched': 'u_watched', ' Watching': 'u_watching', ' want to watch': 'u_wtw', ' stalled': 'u_stalled', ' dropped': 'u_dropped', ' won\'t watch': 'u_ww', ' total episodes': 'u_total_episodes'})
data3 = data3.drop(['u_joined', 'u_follow', 'u_followers', 'u_following', 'u_watched', 'u_watching', 'u_wtw', 'u_stalled', 'u_dropped', 'u_ww'], axis=1)
data3 = data3.applymap(lambda x: x.strip() if type(x) is str else x)
data3 = clean(data3, 'u_name')
data3 = clean(data3, 'u_location')
data3.to_csv('newData/users.csv', index=False)

data4 = pd.read_csv('characters.csv')
data4 = data4.rename(columns={'name': 'c_name', 'url': 'c_url', 'gender': 'c_gender', 'hairColor': 'c_hair_color', 'loveRank': 'c_love_rank', 'hateRank': 'c_hate_rank', 'tags': 'c_tags', 'imageUrl': 'c_image_url', 'loveUserCount': 'c_love_user_count', 'hateUserCount': 'c_hate_user_count', 'anime': 'a_title', 'animeUrl': 'a_url'})
data4 = data4.dropna(subset=['c_tags', 'a_title', 'c_name'], how='any')
data4 = clean(data4, 'c_name')
data4 = clean(data4, 'a_title')
data4['a_title'] = data4['a_title'].apply(str.title)

tagsDf = data4[['c_name', 'a_title', 'c_tags']]
tagsDf = tagsDf.apply(lambda x: pd.Series(map(str.strip, x['c_tags'].split(';'))), axis=1).stack().reset_index(level=1, drop=1).to_frame('c_tag').join(tagsDf[['c_name', 'a_title']])
tagsDf = clean(tagsDf, 'c_tag')
tagsDf.to_csv('newData/ctags.csv', index=False)

data4 = data4[['c_name', 'c_url', 'c_gender', 'c_hair_color', 'c_love_rank', 'c_hate_rank', 'c_image_url', 'c_love_user_count', 'c_hate_user_count', 'a_title', 'a_url']]
data4.to_csv('newData/characters2.csv', index=False)
