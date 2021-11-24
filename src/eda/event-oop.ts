// . OOP version

class Event<Name extends string = string, Version extends string = string> {
  public static eventName: () => string

  constructor(public name: Name, public version: Version, public data: Record<any, any>) {}
}

// .. Example

// class SomeEvent extends EventC<"SomeEvent", "v1"> {
//   public static ename = () => "SomeEvent"
//
//   constructor(
//     public data: { foo: string },
//   ) {
//     super("SomeEvent", "v1", data)
//   }
// }

class EventClassFactory {
  public static create = <Type extends string, Version extends string, Data extends Record<any, any>>(
    name: Type,
    version: Version
  ) => {
    return class extends Event<Type, Version> {
      public static eventName: () => Type = () => name
      constructor(public data: Data) {
        super(name, version, data)
      }
    }
  }
}

// . Example

// class SomeEvent extends EventClassFactory.create<"SomeEvent", "v1", {foo: string}>("SomeEvent", "v1") {}
