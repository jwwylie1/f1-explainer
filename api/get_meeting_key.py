from urllib.request import urlopen
import json
import sys

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python main.py <a> <b> <c>")
        sys.exit(1)

    city = sys.argv[1]
    if city == "None": city = None
    year = sys.argv[2]
    if year == "None": year = None
    
    m = None

    if city and year:
        m = urlopen("https://api.openf1.org/v1/sessions?session_name=Race&location={}&year={}"
                    .format(city, year))
        try:
            gp = json.loads(m.read().decode('utf-8'))[0]
            session_key = gp['session_key']
            print(session_key)
        except:
            print("Grand Prix does not exist in dataset.")
        sys.exit(0)
    elif city and not year:
        m = urlopen("https://api.openf1.org/v1/sessions?session_name=Race&location={}"
                    .format(city))
        gps = json.loads(m.read().decode('utf-8'))
        
        for gp in gps:
            print(gp['location'], gp['year'], ": ", gp['session_key'])
        
    elif not city and year:
        m = urlopen("https://api.openf1.org/v1/sessions?session_name=Race&year={}"
                    .format(year))
        gps = json.loads(m.read().decode('utf-8'))
        
        for gp in gps:
            print(gp['location'], gp['year'], ": ", gp['session_key'])
    else:
        sys.exit(1)
        
    
    