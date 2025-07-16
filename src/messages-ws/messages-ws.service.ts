import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';

interface ConnectedClient {
  [id: string]: {
    socket: Socket;
    user: User;
  };
}

@Injectable()
export class MessagesWsService {
  private connectedClients: ConnectedClient = {};

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async registerClient(client: Socket, userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) throw new Error('User not found');
    if (!user.isActive) throw new Error('User not active');
    if (this.checkUserConnection(user)) {
      throw new Error('User already connected');
    }

    this.connectedClients[client.id] = { socket: client, user };
  }

  removeClient(client: Socket) {
    delete this.connectedClients[client.id];
  }

  getConnectedClients(): string[] {
    console.log(this.connectedClients);
    return Object.keys(this.connectedClients);
  }

  getUserFullNameBySocketId(socketId: string) {
    return this.connectedClients[socketId].user.fullname;
  }

  checkUserConnection(user: User) {
    return Object.values(this.connectedClients).some(
      (client) => client.user.id === user.id,
    );
  }
}
