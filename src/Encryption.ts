
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
        ['encrypt', 'decrypt', 'deriveKey']
    )

    const sessionId = Math.floor(Date.now() * Math.random())


    return {
        sessionId,
        sessionKey,
        messageCounter: 0
    }
}

async function deriveMessageKey(session: Session, salt: Uint8Array): Promise<CryptoKey> {
    const messageKey = await crypto.subtle.deriveKey({
            name: 'HKDF',
            hash: 'SHA-256',
            salt,
            info: new Uint8Array([session.messageCounter]).buffer
        },
        session.sessionKey,
        {
            name: 'AES-GCM',
            length: 256
        },
        true,
        ['encrypt', 'decrypt']
    )

    session.messageCounter++

    return messageKey
}

async function encryptMessage(message: string, messageKey: CryptoKey): Promise<{iv: Uint8Array, encryptedContent: ArrayBuffer}> {
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


async function decryptMessage(encryptedContent: ArrayBuffer, iv: Uint8Array, messageCounter: number, session: Session, salt: Uint8Array): Promise<String> {
    const tempCounterState = session.messageCounter
    session.messageCounter = messageCounter
    const derivedKey = await deriveMessageKey(session, salt)
    session.messageCounter = tempCounterState

    const decoder = new TextDecoder()
    let decryptedContent

    try {
        decryptedContent = await crypto.subtle.decrypt(
        {name: 'AES-GCM', iv: iv},
        derivedKey,
        encryptedContent
    )
    } catch (err) {
        console.log(err)
        return 'Could not decrypt content'
    }

    return decoder.decode(decryptedContent)
}