
import * as crypto from 'crypto'

interface EncryptedMessage{
    iv: string,
    salt: string,
    messageCounter: number,
    sessionId: number,
    content: ArrayBuffer
}

interface Session {
    sessionId: number,
    sessionKey: CryptoKey,
    messageCounter: number
}

// how do i decide who creates a group session/ sends out the key? what about when we are swtiching sesssions
// due to people joining / leaving ?
// we will also want to create a new session every x messages, what about then? the last person to send a message,
// could create the session but what if they've gone offline or what multiple people believe they've sent the last message?
// F M L
async function createSession(): Promise<Session> {
    const sessionKey = await crypto.subtle.generateKey(
        {name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
    )

    const sessionId = Math.floor(Date.now() * Math.random())


    return {
        sessionId,
        sessionKey,
        messageCounter: 0
    }
}

async function encryptMessage(message: string, messageKey: CryptoKey) {
    const iv = crypto.getRandomValues(new Uint8Array(12))
    const encoder = new TextEncoder()
    const content = encoder.encode(message)

    const encryptedContent = await crypto.subtle.encrypt(
        {name: 'AES-GCM', iv: iv},
        messageKey,
        content
    )
    // this needs to be combined with salt / counter / id to form an encryptedmessage interface
    return {
        iv,
        encryptedContent
    }
}