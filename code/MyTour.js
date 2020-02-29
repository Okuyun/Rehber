class tour {

    constructor(document) {
        this.initLibrary(document);

    }
    initLibrary(document) {
        let script = document.createElement("script");
        script.src = "https://unpkg.com/@popperjs/core@2"
        document.body.appendChild(script);
    }
    addMessage(message) {
        message.targetID
        message.header
        message.messsage
    }
}

class message {
    constructor(targetID, header, messsage) {
        this.targetID = targetID;
        this.header = header;
        this.message = messsage;
    }
}