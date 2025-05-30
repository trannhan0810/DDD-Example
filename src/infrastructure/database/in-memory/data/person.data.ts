import { CryptoService } from '@infrastructure/adapters/cryto';

const cryptoService = new CryptoService();

export const mockPersonData = [
  {
    id: 1,
    firstname: 'Admin',
    lastname: 'System',
    email: 'superadmin@sytem.com',
    hashedPassword: cryptoService.hashPasswordSync('admin123'),
  },
  {
    id: 2,
    firstname: 'Evan',
    lastname: 'Lopez',
    email: 'fufwe@udamo.yt',
    hashedPassword: cryptoService.hashPasswordSync('32fwe34'),
  },
  {
    id: 3,
    firstname: 'Rosa',
    lastname: 'McKinney',
    email: 'nit@hampuwka.eu',
    hashedPassword: cryptoService.hashPasswordSync('23423fr'),
  },
  {
    id: 4,
    firstname: 'Lee',
    lastname: 'Hines',
    email: 'erehe@ek.lu',
    hashedPassword: cryptoService.hashPasswordSync('44g6232f'),
  },
  {
    id: 5,
    firstname: 'Rena',
    lastname: 'Young',
    email: 'wirome@co.sr',
    hashedPassword: cryptoService.hashPasswordSync('35g78dv'),
  },
];
