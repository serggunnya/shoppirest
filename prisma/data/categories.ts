import { Prisma } from '@prisma/client';

export const categories: Prisma.CategoryCreateInput[] = [
  {
    name: 'Телефоны',
    alias: 'smph',
    attributes: {
      create: [
        {
          name: 'Производитель',
          alias: 'smph_brand',
          options: {
            create: [
              { value: 'Apple', alias: 'apple' },
              { value: 'Xiaomi', alias: 'xiaomi' },
              { value: 'Google', alias: 'google' },
              { value: 'Samsung', alias: 'samsung' },
              { value: 'Realme', alias: 'realme' },
              { value: 'Poco', alias: 'poco' },
            ],
          },
        },
        {
          name: 'Операционная система',
          alias: 'smph_os',
          options: {
            create: [
              { value: 'Android', alias: 'android' },
              { value: 'IOS', alias: 'ios' },
            ],
          },
        },
        {
          name: 'Количество ядер',
          alias: 'smph_cores',
          options: {
            create: [
              { value: '4', alias: '4' },
              { value: '6', alias: '6' },
              { value: '8', alias: '8' },
            ],
          },
        },
        {
          name: 'Производитель процессора',
          alias: 'smph_core_brand',
          options: {
            create: [
              { value: 'Apple', alias: 'apple' },
              { value: 'Google', alias: 'google' },
              { value: 'MediaTek', alias: 'mediaTek' },
              { value: 'Qualcomm', alias: 'qualcomm' },
              { value: 'Samsung', alias: 'samsung' },
              { value: 'Unisoc', alias: 'unisoc' },
            ],
          },
        },
        {
          name: 'Графический ускоритель',
          alias: 'smph_gpu',
          options: {
            create: [
              { value: 'Adreno 610', alias: 'adreno610' },
              { value: 'Adreno 642L', alias: 'adreno642l' },
              { value: 'Adreno 644', alias: 'adreno644' },
              { value: 'Adreno 650', alias: 'adreno650' },
              { value: 'Adreno 660', alias: 'adreno660' },
              { value: 'Adreno 730', alias: 'adreno730' },
              { value: 'Adreno 740', alias: 'adreno740' },
              { value: 'Apple GPU', alias: 'applegpu' },
              { value: 'Mali-G51 MP4', alias: 'malig51mp4' },
              { value: 'Mali-G52 MC2', alias: 'malig52mc2' },
              { value: 'Mali-G52 MP1', alias: 'malig52mp1' },
              { value: 'Mali-G52 MP2', alias: 'malig52mp2' },
              { value: 'Mali-G57 MC1', alias: 'malig57mc1' },
              { value: 'Mali-G57 MP2', alias: 'malig57mp2' },
              { value: 'Mali-G68', alias: 'malig68' },
              { value: 'Mali-G68 MP4', alias: 'malig68mp4' },
              { value: 'Mali-G68 MP5', alias: 'malig68mp5' },
              { value: 'Mali-G76 MP4', alias: 'malig76mp4' },
              { value: 'Mali-G78', alias: 'malig78' },
              { value: 'Mali-T820 MP1', alias: 'malit820mp1' },
              { value: 'PowerVR GE 8320', alias: 'pvrge8320' },
              { value: 'PowerVR GE 8322', alias: 'pvrge8322' },
              { value: 'Samsung Xclipse 920', alias: 'xclipse920' },
            ],
          },
        },
        {
          name: 'Тип экрана',
          alias: 'smph_screen',
          options: {
            create: [
              { value: 'AMOLED', alias: 'amoled' },
              { value: 'Super AMOLED', alias: 'samoled' },
              { value: 'IPS', alias: 'ips' },
              { value: 'OLED', alias: 'oled' },
            ],
          },
        },
        {
          name: 'Частота обновления экрана',
          alias: 'smph_screen_rate',
          options: {
            create: [
              { value: '60Гц', alias: '60hz' },
              { value: '90Гц', alias: '90hz' },
              { value: '120Гц', alias: '120hz' },
              { value: '144Гц', alias: '144hz' },
            ],
          },
        },
        {
          name: 'Внутренняя память',
          alias: 'smph_storage',
          options: {
            create: [
              { value: '16Гб', alias: '16gb' },
              { value: '32Гб', alias: '32gb' },
              { value: '64Гб', alias: '64gb' },
              { value: '128Гб', alias: '128gb' },
              { value: '256Гб', alias: '256gb' },
              { value: '512Гб', alias: '512gb' },
            ],
          },
        },
        {
          name: 'Оперативная память',
          alias: 'smph_ram',
          options: {
            create: [
              { value: '2Гб', alias: '2gb' },
              { value: '3Гб', alias: '3gb' },
              { value: '4Гб', alias: '4gb' },
              { value: '6Гб', alias: '6gb' },
              { value: '8Гб', alias: '8gb' },
              { value: '12Гб', alias: '12gb' },
            ],
          },
        },
        {
          name: 'Проводной интерфейс',
          alias: 'smph_interface',
          options: {
            create: [
              { value: 'Lightning', alias: 'lightning' },
              { value: 'USB-C', alias: 'usbc' },
              { value: 'micro USB', alias: 'microusb' },
            ],
          },
        },
        {
          name: 'Быстрая зарядка',
          alias: 'smph_charge',
          options: {
            create: [
              { value: 'Fast Charge', alias: 'fastcharge' },
              { value: 'Adaptive Fast Charge', alias: 'adpfastcharge' },
              { value: 'FlashCharge', alias: 'flashcCharge' },
              { value: 'Quick Charge 2.0', alias: 'quickcharge2' },
              { value: 'Quick Charge 3.0', alias: 'quickcharge3' },
              { value: 'Power Deliver 3.0', alias: 'powerdeliver3' },
            ],
          },
        },
      ],
    },
  },
  {
    name: 'Телевизоры',
    alias: 'tvs',
    attributes: {
      create: [],
    },
  },
  {
    name: 'Ноутбуки',
    alias: 'notebooks',
    attributes: {
      create: [],
    },
  },
  {
    name: 'Видеокарты',
    alias: 'gpu',
    attributes: {
      create: [],
    },
  },
  {
    name: 'материнские платы',
    alias: 'motherboards',
    attributes: {
      create: [],
    },
  },
];
