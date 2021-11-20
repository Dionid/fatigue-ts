// . FOP version

export type Event<Name extends string, Version extends string, Data extends Record<any, any>> = {
  name: Name
  data: Data
  version: Version
}

export const Event = {
  create: <Name extends string, Version extends string, Data extends Record<any, any>>(
    eName: Name,
    eVersion: Version,
    eData: Data,
  ): Event<Name, Version, Data> => {
    return {
      name: eName,
      data: eData,
      version: eVersion,
    }
  },
  is: <E extends Event<any, any, any>>(event: Event<any, any, any>, name: E["name"]): event is E => {
    return event.name === name
  },
}

// . Example

// type SomeEvent = Event<"SomeEvent", "v1", {
//   foo: string
// }>
//
// const SomeEvent = {
//   name: () => "SomeEvent",
//   create: (data: SomeEvent["data"]): SomeEvent => Event.create("SomeEvent", "v1", data),
//   is: (event: Event<any, any, any>): event is SomeEvent => Event.is<SomeEvent>(event, "SomeEvent"),
// }

// . With Event Factory

// export type EventBehaviourFactory<E extends Event<any, any, any>> = {
//   name: () => E['name']
//   create: (data: E['data']) => Event<E["name"], E["version"], E["data"]>
//   is: (e: Event<any, any, any>) => e is E
// }

export const EventBehaviourFactory = {
  create: <E extends Event<any, any, any>>(
    name: E['name'],
    version: E['version']
  ) => {
    return {
      name: () => name,
      create: (data: E["data"]) => Event.create(name, version, data),
      is: (event: Event<any, any, any>): event is E => Event.is<E>(event, name),
    }
  }
}

// type SomeEvent = Event<"SomeEvent", "v1", {
//   foo: string
// }>
//
// const SomeEvent = EventBehaviourFactory.create<SomeEvent>(
//   "SomeEvent",
//   "v1",
// )
