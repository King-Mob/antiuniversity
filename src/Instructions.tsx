import Markdown from "react-markdown";

const content = `
**WELCOME TO ANTIUNI 2025**
The Antiuniversity is an ongoing programme of self organised radical learning and mutual education events. It is a collaborative experiment to challenge academic and class hierarchy - in, outside and against existing institutional structures. 

**KEY 2025 Dates**
Submissions open: Sunday 20th July – 31st August 2025
Facilitation workshop: to be confirmed (check instagram)
Festival dates: 13th – 19th October 2025

**HOW DOES THE ANTIUNI WORK?**

Anyone can organise an Antiuni event in any format, anywhere!
While the co-organisers at Antiuni HQ help administrate the platform, it’s the events’ organisers who make the Antiuniversity what it is. The idea is that all of us – organisers, hosts and guests – work collaboratively to create and share new forms of knowledge and develop new skills.

Past events have contained elements of the following – participation, open-ended (but structured) discussion, collaboration, a practical workshop, a walk, an educational (or otherwise) experiment, a public space intervention, direct action…

There is no application process - all events are included as long as they follow the Antiuni principles outlined [here](https://festival.antiuniversity.org/pages/about) (in short - cause no harm)

You may have a fully formed idea, with a platform and a specific audience in mind, or you might want to discuss your ideas with us. We will be holding facilitation sessions to help with brainstorming or any questions. Check our instagram for updates on facilitation sessions!

Our submission system simplifies the registration process and spreads the work of organising a festival across all participants. You will now be able to upload your event directly and instantly to the Antiuni website. No more boring admin emails!


**TO ORGANISE AN EVENT, FOLLOW THESE STEPS:**


**1. Register as an organiser**

First you need to register as an organiser. Click on the log in / register button to open the log in sidebar. Please use a valid contact so we can communicate with you about your event.

**2. Choose a venue**

Antiuni festival takes place in-person and online. There are a number of venues that are available to host Antiuni events. You can choose from the different spaces when registering your event and book a time slot.
If you have organised your own venue (or are meeting in a public space e.g. a park), you need to add it on the Venues tab first before creating an event. Fill in all the place details, including the time slots that the venue is available. Make sure you make the times for your event available so you can choose them when you create the event. If there is extra capacity at the venue, you can make more slots available for other people to book.
Most of the available venues are in London, but feel free to add venues/events anywhere! 
When choosing (or creating) a venue, consider accessibility and capacity. If you have any requests or want help choosing a place, get in touch with us or come to our facilitation meeting. 
If your event is online, you don’t need to create a new online venue before registering the event. You can simply choose the ‘online Antiuni space’ and make sure you include the link to your digital session to your event details. If you want to create your own online venue especially for your events then you can do that too.  
Venues and time slots will be updated throughout the submissions period, so check back in the next few days after submissions have opened if there’s nothing suitable for you right now.

**3. Create event**

Click on the HOME tab and then click on CREATE EVENT.
Fill in the different fields. Upload a fitting image. 
We need you to use a valid email address or phone number so that we can contact you ahead of your event. 

Select a venue from the listed venues on the website. Pick an available time slot. If you need more time, select a few time slots in a row. If your event start/end time is different from (but within!) the chosen timeslots then include the actual timing in the event description. 
If your event is online, choose the ‘online Antiuni space’ and include a link to your digital session in your event description. 
If you want to do a video call and don’t have membership to a particular platform, we would recommend using jitsi which is a free online video call platform without time limits.
The Antiuni platform doesn’t include a way for people to sign up to attend events, as all events are publically visible. Attendance can vary a lot so be prepared for less/more people than you anticipated. If you want to require attendees to register beforehand (e.g. to limit numbers) then we would encourage you to set up an eventbrite page for your event, and link it in your event description. Alternatively, you could include your email address and ask potential attendees to contact you ahead of time.
Click save! You can save your event as a draft if it is not ready to be publically visible yet. 
Let us know if you need any help!

**4. Edit event**

When you are logged in, you can always edit your event if you have made a mistake or something has changed. Remember not to edit too much or too close to the date. The changes might not reach the participants, or confuse them. 
When submissions close, you can no longer add an event but you can still edit pre-existing events if needed. 


**5. Need help planning your event?**

Join the facilitation session! We will organise at least one facilitation session during the submissions period, at which you can talk to the festival organisers about any problems, and brainstorm ideas for your event. Check our instagram for updates about when this session will take place. If you can’t make it and have any other questions or want help with anything, let us know over email or instagram. 

**6. Ahead of the festival**

We will promote all Antiuni events on social media. Please follow, share, and add your own posts about the festival and your own event. Direct people to the website to find out more.
Please have the word Antiuniversity somewhere in your event title so people come across it when searching for the festival and other events.
Making sure every Antiuni event gets enough exposure and interest is a massive task!
If you have social media / promotion skills and want to be involved in the Antiuni organising team, then get in touch as we could use more help!
There are only a few of us at Antiuni HQ so we need your support in promoting your event and the wider festival. This is a collaborative effort and we expect organisers to support each other – mention other events when promoting yours, retweet and share.
We will try to organise a social for event organisers to help connect the Antiuni community – please attend if you can!

**7. During the festival**

Make sure your space is ready in advance. If it is virtual, do a test run, check that your links are working. If it is physical, make sure it is well signposted and the address is precise.
You might want to take pictures or record your event for our archive. If you do, make sure you have every participant’s approval to do so.
Resources for running online events:
Eventbrite [Tips](https://www.eventbrite.co.uk/blog/coronavirus-event-tips-resources/) and [Guide](https://www.eventbrite.co.uk/blog/how-to-host-an-online-event-or-webinar-that-live-event-attendees-will-love-ds00/)
[Zoom Technical Handbook by LRU](https://docs.google.com/document/d/1kxbFLnX77SPlSDjazFYasiojD9ubXO9AeokNEzZWvWc/edit?usp=sharing)

**8. After the festival**

Send us any photos, observations, or useful quotes from guests and hosts. 
We encourage you to use your event as a jumping off platform to build new communities or regular events. Keep in touch in future so we can help build up the wider Antiuni ecosystem and boost other relevant projects. 
If you need support from Antiuni HQ, feel free to reach us via email or instagram. Links are on the [contact page](/contact).  

`;

function Instructions() {
    return (
        <div className="markdown-content">
            <Markdown>{content}</Markdown>
        </div>
    );
}

export default Instructions;
