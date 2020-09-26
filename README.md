# washu-gives

**The problem:**
* In the past calendar year, the Washington University community has seen an increase in mutual aid responses to both campus and national crises. 
* This mutual aid is most frequently organized in Google Sheets and shared through social media—two strategies which are not effective in making sure anyone who needs it has access to it 
* Replication of resources and disorganization of aid available makes the process more cumbersome than necessary 
* Sample: https://docs.google.com/spreadsheets/d/1wFbLkZqZ19QlAnRAwvZT8Vetn--Oy2X8qVlrDhaaMMg/edit?usp=sharing 
* Intended audience: The Washington University community with extensibility to other educational institutions with the possibility of other entities 
**The proposed solution:** 
* An intuitive webpage that allows for anyone with a verified @wustl.edu email address to access aid advertised by the community. 
* Two access points: 
    * Giving:
        * Any user can input what kind of help they want to offer, valid dates, secure contact information and any other pertinent details 
        *This data is then displayed in its respective category (i.e. childcare services on weekends from 4 p.m. to 10 p.m. would be listed in “Childcare”) 
    * Searching: 
        * Any user with a valid @wustl.edu email address can access the aid available by writing to the posted user’s @wustl.edu email address 
**Technical specifications:**
* Angular with NodeJS 
* Hosted by AWS 
* Firebase


**MVP Expectations:**
* User can successfully register and authenticate an account with an @wustl.edu 
* The user should have access to give/search  
* If giving: 
    *The user can enter basic details with contact via a form 
    *Data is read/stored by category 
* If searching:
    *User should be able to search by type 
    *Easily access giver’s email 

Gmail account for firebase access:
Email: washugives@gmail.com
Password: washugives437S
