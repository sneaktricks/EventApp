import { IEvent } from "./definitions";

export const events: readonly IEvent[] = [
  {
    id: "1",
    name: "The first event",
    description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ligula dolor, placerat non mauris iaculis, venenatis sagittis dui. Fusce tincidunt, magna semper maximus accumsan, felis libero sagittis magna, at suscipit velit mi consequat arcu. Mauris id sapien odio. Quisque tincidunt blandit augue, et vestibulum nisl consequat a. Integer accumsan, ex eu rhoncus porta, lorem ligula condimentum purus, nec auctor libero libero sit amet ante. Vestibulum ultricies quis magna a tempor. Quisque vel sapien nisi. Nulla fringilla tincidunt diam, et porta ante. Sed id ante non metus ornare condimentum facilisis et ipsum. Curabitur dictum metus quis dolor condimentum, ac porta sapien venenatis.

        Aenean aliquet porttitor sem, et fringilla lectus condimentum ut. Etiam sagittis lectus est, eget vulputate arcu dignissim in. Phasellus vestibulum eros ac aliquam viverra. Nam at ex ultricies, volutpat risus vitae, interdum lorem. Duis nec nunc id nisi malesuada fringilla at non magna. Integer sed dignissim massa, in ullamcorper mauris. Donec porta ornare efficitur. Ut non arcu iaculis, imperdiet massa in, accumsan lectus. Ut ultricies tortor eu ligula varius, tempus suscipit orci venenatis. Duis nec consequat justo. Vestibulum tristique, eros ac posuere semper, nisl turpis aliquam sapien, nec dignissim sem tellus a massa. Praesent sagittis vulputate fermentum. In finibus quis leo vel volutpat.
        
        Vivamus dictum aliquam erat et tincidunt. Duis ornare eros odio, in laoreet elit laoreet quis. Phasellus consectetur felis mauris, a tempor massa aliquam vel. Sed non molestie mauris, at mattis eros. Sed venenatis finibus nisl, in egestas urna blandit a. Donec bibendum nisl ante, eu hendrerit lorem maximus a. Sed semper rutrum accumsan.
        
        Vivamus maximus dolor dolor, in auctor purus congue vel. In congue ornare mauris sit amet aliquam. Nunc nec purus id augue auctor scelerisque sit amet non dui. Sed faucibus bibendum consectetur. Interdum et malesuada fames ac ante ipsum primis in faucibus. Sed luctus augue eros, non ullamcorper odio varius id. Curabitur vestibulum ante sed diam placerat porttitor. Vivamus pretium dui libero, id faucibus leo efficitur eu.
        
        Donec metus turpis, sodales vitae faucibus sed, auctor quis erat. Donec vitae risus justo. Nulla eu urna erat. Fusce bibendum libero mauris, vel vulputate odio iaculis non. Donec at nisl faucibus magna porta malesuada quis nec ex. Aenean tincidunt mauris a turpis vehicula, in consectetur lectus varius. Nullam ullamcorper turpis a neque euismod sollicitudin. Curabitur condimentum viverra tortor, et tempor elit pretium nec. In turpis elit, tincidunt eu justo in, convallis lobortis velit. Nunc sollicitudin at mi sed imperdiet.`,
    location: "Nowhere",
    participantCount: 42,
    participantLimit: null,
    startsAt: new Date(),
    endsAt: new Date(Date.now() + 1000 * 60 * 60 * 2),
    participationStartsAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    participationEndsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    visibility: "public",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    name: "Test Event #2",
    description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ligula dolor, placerat non mauris iaculis, venenatis sagittis dui. Fusce tincidunt, magna semper maximus accumsan, felis libero sagittis magna, at suscipit velit mi consequat arcu. Mauris id sapien odio. Quisque tincidunt blandit augue, et vestibulum nisl consequat a. Integer accumsan, ex eu rhoncus porta, lorem ligula condimentum purus, nec auctor libero libero sit amet ante. Vestibulum ultricies quis magna a tempor. Quisque vel sapien nisi. Nulla fringilla tincidunt diam, et porta ante. Sed id ante non metus ornare condimentum facilisis et ipsum. Curabitur dictum metus quis dolor condimentum, ac porta sapien venenatis.

        Aenean aliquet porttitor sem, et fringilla lectus condimentum ut. Etiam sagittis lectus est, eget vulputate arcu dignissim in. Phasellus vestibulum eros ac aliquam viverra. Nam at ex ultricies, volutpat risus vitae, interdum lorem. Duis nec nunc id nisi malesuada fringilla at non magna. Integer sed dignissim massa, in ullamcorper mauris. Donec porta ornare efficitur. Ut non arcu iaculis, imperdiet massa in, accumsan lectus. Ut ultricies tortor eu ligula varius, tempus suscipit orci venenatis. Duis nec consequat justo. Vestibulum tristique, eros ac posuere semper, nisl turpis aliquam sapien, nec dignissim sem tellus a massa. Praesent sagittis vulputate fermentum. In finibus quis leo vel volutpat.
        
        Vivamus dictum aliquam erat et tincidunt. Duis ornare eros odio, in laoreet elit laoreet quis. Phasellus consectetur felis mauris, a tempor massa aliquam vel. Sed non molestie mauris, at mattis eros. Sed venenatis finibus nisl, in egestas urna blandit a. Donec bibendum nisl ante, eu hendrerit lorem maximus a. Sed semper rutrum accumsan.
        
        Vivamus maximus dolor dolor, in auctor purus congue vel. In congue ornare mauris sit amet aliquam. Nunc nec purus id augue auctor scelerisque sit amet non dui. Sed faucibus bibendum consectetur. Interdum et malesuada fames ac ante ipsum primis in faucibus. Sed luctus augue eros, non ullamcorper odio varius id. Curabitur vestibulum ante sed diam placerat porttitor. Vivamus pretium dui libero, id faucibus leo efficitur eu.
        
        Donec metus turpis, sodales vitae faucibus sed, auctor quis erat. Donec vitae risus justo. Nulla eu urna erat. Fusce bibendum libero mauris, vel vulputate odio iaculis non. Donec at nisl faucibus magna porta malesuada quis nec ex. Aenean tincidunt mauris a turpis vehicula, in consectetur lectus varius. Nullam ullamcorper turpis a neque euismod sollicitudin. Curabitur condimentum viverra tortor, et tempor elit pretium nec. In turpis elit, tincidunt eu justo in, convallis lobortis velit. Nunc sollicitudin at mi sed imperdiet.`,
    location: "Here",
    participantLimit: 100000,
    participantCount: 12345,
    startsAt: new Date(),
    endsAt: new Date(Date.now() + 1000 * 60 * 60 * 2),
    participationStartsAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    participationEndsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    visibility: "public",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    name: "Test Event 3",
    description: "Yeah!",
    location: "Somewhere",
    participantLimit: 100,
    participantCount: 0,
    startsAt: new Date(),
    endsAt: new Date(Date.now() + 1000 * 60 * 60 * 2),
    participationStartsAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    participationEndsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    visibility: "public",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
