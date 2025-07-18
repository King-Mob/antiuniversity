import Markdown from "react-markdown";

const content = `
Email Antiuniversity Now on [antiuniversitynow@gmail.com](mailto:antiuniversitynow@gmail.com)

Join us on [Facebook](https://www.facebook.com/antiuniversityofeastlondon?fref=ts)

Follow [@antiuniversity](https://twitter.com/antiuniversity) on Twitter

Follow [@antiuniversitynow](https://www.instagram.com/antiuniversitynow) on Instagram

The best way to contact us is via email or instagram. We are a tiny team of volunteers and may take some time to get back to you – sorry in advance! 

We aim to get our mailing list up and running again soon, watch this space 😊
`;

function Contact() {
    return (
        <>
            <Markdown>{content}</Markdown>
        </>
    );
}

export default Contact;
