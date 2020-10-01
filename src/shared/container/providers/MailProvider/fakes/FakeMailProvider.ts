import IMailProvider from '../models/IMailProvider';

interface IMessage {
  recipient: string;
  body: string;
}

class FakeMailProvider implements IMailProvider {
  private messages: IMessage[] = [];

  public async sendMail(recipient: string, body: string): Promise<void> {
    this.messages.push({ recipient, body });
  }
}

export default FakeMailProvider;
