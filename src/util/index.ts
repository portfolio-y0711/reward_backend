function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

const uid4digit = () => uuidv4().slice(32)
const uid8digit = () => uuidv4().slice(28)

export { uid4digit, uid8digit, uuidv4 }
