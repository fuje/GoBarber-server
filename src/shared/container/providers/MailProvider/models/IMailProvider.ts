export default interface IMailProvider {
  sendMail(recipient: string, body: string): Promise<void>;
}
