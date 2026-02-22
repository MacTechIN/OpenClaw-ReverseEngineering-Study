export function createChannelManager() {
    return {
        sendMessage: (msg: string) => console.log(`[Limbs] Sending: ${msg}`),
        connect: () => console.log("[Limbs] Ready to move!")
    };
}
