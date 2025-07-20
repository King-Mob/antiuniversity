import Markdown from "react-markdown";

const content = `
**Antiuniversity Now** is a collaborative experiment to challenge institutionalised education, access to learning and the mechanism of knowledge creation and distribution.

Initiated in 2015, Antiuniversity Now was set up to reignite the [1968 Antiuniversity of London](https://www.antiuniversity.org/history/) with the intention to challenge academic and class hierarchy and the exclusivity of the £9K-a-year-degree by inviting people to organise and share learning events in public spaces all over the country.

**Who makes the Antiuniversity?**

Antiuniversity events are open to all to organise and attend, regardless of experience, background, age or qualification. All you need is an interesting idea and an openness to share it with others in a collaborative way.

For inspiration, you can check out the Antiuniversity archive [here.](https://www.antiuniversity.org/archive/)

**What does an Antiuni event look like?**

Antiuni events can take any form, anywhere (as long as we don’t put each other at risk). They are free, accessible and inclusive, using non-hierarchical, participatory and democratic pedagogy.

**What are the rules?**

The Antiuniversity does not have a fixed constitution – it is shaped by everyone who takes part, as organiser, host or guest.

However, all our activities are firmly rooted in a collective desire to create and sustain safe autonomous spaces for radical learning that follow, nurture and enact anti-capitalist, anarchist, feminist, anti-racist, de-colonial, anti-fascist, queer, trans and sex worker- inclusive values through conversation and direct action.

All events will be accepted, providing they do not cause any harm.

`;

function About() {
    return (
        <div className="markdown-content">
            <Markdown>{content}</Markdown>
        </div>
    );
}

export default About;
