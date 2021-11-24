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

export const Event = {
  create,
  is
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

// type SomeEvent = Event<"SomeEvent", "v1", {
//   foo: string
// }>
//
// const SomeEvent = EventBehavior.createCurriedNameVersion<SomeEvent>(
//   "SomeEvent",
//   "v1",
// )

export const createCurriedNameVersion = <E extends Event>(name: E['name'], version: E['version']) => {
  return {
    name: () => name,
    create: (data: E['data']) => create(name, version, data),
    is: (event: Event): event is E => is<E>(event, name)
  }
}

export const EventBehavior = {
  createCurriedNameVersion
}
