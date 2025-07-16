import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'http';
import { Socket } from 'socket.io';
import { JwtPayload } from 'src/auth/interfaces';
import { NewMessageDto } from './dtos/new-message.dto';
import { MessagesWsService } from './messages-ws.service';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;

  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.headers['authentication'] as string;
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify(token);
      await this.messagesWsService.registerClient(client, payload.id);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      client.disconnect();
      return;
    }

    // console.log({ payload });

    this.wss.emit(
      'clients-updated',
      this.messagesWsService.getConnectedClients(),
    );

    //! If you want add client to a specific room
    // client.join('main-room'); // or ventas-room or proveedores-room etc
    //! or you can create a room whose name is the client id or email id of leader
    // client.join(client.id);
    //! then, if you want to send a message to a specific room
    // this.wss.to('main-room').emit('message-from-server', {
    //   fullName: 'NestJS',
    //   message: 'hello world',
    //})
    //! finally, if you want remove client from a specific room
    // client.leave('main-room');
  }
  handleDisconnect(client: Socket) {
    this.messagesWsService.removeClient(client);

    this.wss.emit(
      'clients-updated',
      this.messagesWsService.getConnectedClients(),
    );
  }

  @SubscribeMessage('message-from-client')
  onClientMessage(client: Socket, payload: NewMessageDto) {
    // console.log({ client: client.id, payload });
    // client.broadcast.emit('client-message', payload);

    //! client.emit only emit to one client
    // client.emit('message-from-server', {
    //   fullName: 'NestJS',
    //   message: payload.message || 'no message',
    // });

    //! client.broadcast.emit emit to all clients except the one that sent the message
    // client.broadcast.emit('message-from-server', {
    //   fullName: 'NestJS',
    //   message: payload.message || 'no message',
    // });

    //! this.wss.emit emit to all clients
    this.wss.emit('message-from-server', {
      fullName: this.messagesWsService.getUserFullNameBySocketId(client.id),
      message: payload.message || 'no message',
    });
  }
}
