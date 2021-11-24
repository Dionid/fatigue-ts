// . FOP version

export type Event<
  Name extends string = string,
  Version extends string = string,
  Data extends Record<any, any> = Record<any, any>
> = {
  name: Name
  data: Data
  version: Version
}

export const create = <Name extends string, Version extends string, Data extends Record<any, any>>(
  eName: Name,
  eVersion: Version,
  eData: Data
): Event<Name, Version, Data> => {
  return {
    name: eName,
    data: eData,
    version: eVersion
  }
}

export const is = <E extends Event>(event: Event, name: E['name']): event is E => {
  return event.name === name
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

export const createBehavior = <E extends Event>(name: E['name'], version: E['version']) => {
  return {
    name: () => name,
    create: (data: E['data']) => create(name, version, data),
    is: (event: Event): event is E => is<E>(event, name)
  }
}

// type SomeEvent = Event<"SomeEvent", "v1", {
//   foo: string
// }>
//
// const SomeEvent = createBehavior.create<SomeEvent>(
//   "SomeEvent",
//   "v1",
// )

export const Event = {
  create,
  is,
  createBehavior
}
