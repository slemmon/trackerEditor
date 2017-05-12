function customEventEmitter (eventName, detail) {
    const event = new CustomEvent(eventName, {detail})
    document.dispatchEvent(event)
}

export default customEventEmitter
