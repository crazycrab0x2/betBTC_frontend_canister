export const convertToDataURL = (blob: Blob): Promise<string | ArrayBuffer | null> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result) // Resolve the promise with the data URL on success
    reader.onerror = () => reject(reader.error) // Reject the promise on error
    reader.readAsDataURL(blob)
  })
}
