from urllib.request import urlopen
import json
import whisper
import radio_helpers_python
import pandas as pd
import predictor

SESSION_KEY = 9126

def transcribe_messages():

    response = urlopen('https://api.openf1.org/v1/team_radio?session_key={}'.format(SESSION_KEY))
    print('opened')
    data = json.loads(response.read().decode('utf-8'))
    print('read')
    model = whisper.load_model("large-v3-turbo")
    print('model loaded')
    
    with open("temp.jsonl", "a") as f:
    
        for datum in data:
            #if datum['date'] < "2023-03-19T17:11:01.397000+00:00": continue
            #else: 
            # print(datum['date'])
            mp3_url = datum['recording_url']
            
            info = radio_helpers_python.get_extra_info(SESSION_KEY, datum)

            result = radio_helpers_python.fix_terms(model.transcribe(mp3_url)['text'])
            
            # print(mp3_url)        
            
            # new_string = f"{{\"prompt\": \"Radio: {result}\\nContext: Driver = {info[0]}, Lap = {info[1]}, Compound = {info[2]}, Position = {info[5]}, Gap ahead = {info[3]}, Weather = {info[4]}.\", \"completion\": \"{completion}\"}}\n"
            new_string = f"{{'input': 'Instruction: Explain the following Formula 1 team radio message in simple terms, as if talking to someone unfamiliar with the sport. Make sure to clarify any racing-specific jargon or situations.\n\nRadio: {result}\nContext: Driver = {info[0]}, Lap = {info[1]}, Compound = {info[2]}, Position = {info[5]}, Gap ahead = {info[3]}, Weather = {info[4]}.'}}"
            
            print(result)
            #print(predictor.generate_response(new_string))

            f.write(new_string)
    
if __name__ == "__main__":
    transcribe_messages()