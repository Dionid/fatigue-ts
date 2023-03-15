import { EventHandler, Event, EventMessage, MessageFromEvent, EventHandlerRun, EventsRecord } from '../events'
import { EventSubscriberNotFoundError } from './errors'
import { bindEventBusToEvents, EventBus, EventsToPublish } from './event-bus'
import { Logger } from './logger'

export const InMemoryEventBusName = 'InMemoryEventBus'

export type InMemoryEventBus<Ctx extends Record<any, any>, ER extends EventsRecord> = EventBus<Ctx, ER>

export const InMemoryEventBus = <Ctx extends Record<any, any>, ER extends EventsRecord>(
  props: {
    ctx?: () => Ctx
    logger?: Logger
    eventsToPublish?: ER
  } = {}
): InMemoryEventBus<Ctx, ER> => {
  const ctx = () => {
    return props.ctx ? props.ctx() : ({} as Ctx)
  }

  const { eventsToPublish } = props

  // # Logger
  let logger: Logger = props.logger ?? {
    info: console.log,
    error: console.error,
    warn: console.warn,
    child: () => {
      return console
    }
  }

  if (logger.child) {
    logger = logger.child({
      dfEventBus: InMemoryEventBusName
    })
  }

  // # Subscribe maps
  let eventSubscribersMap: Record<string, EventHandler<any, Ctx>[]> = {}

  // # PUBLISH EVENTS

  const publishEvent = async <E extends Event<string, EventMessage<string, any, any>>>(
    event: MessageFromEvent<E>
  ): Promise<void> => {
    const eventSubscriberList = eventSubscribersMap[event.name] as EventHandler<E, Ctx>[] | undefined

    if (!eventSubscriberList) {
      throw new EventSubscriberNotFoundError(event.name)
    }

    eventSubscriberList.map(async (eventSubscriber) => {
      await eventSubscriber.run(event, ctx())
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const transportAssignedEvents: EventsToPublish<ER> = bindEventBusToEvents(publishEvent, eventsToPublish ?? ({} as ER))

  return {
    // # INIT
    init: async () => {
      return
    },
    stop: async () => {
      return
    },
    restart: async () => {
      return
    },
    destroy: async () => {
      eventSubscribersMap = {}
    },

    ctx,

    // # EVENT
    event: {
      publish: publishEvent,
      subscribe: async <E extends Event<string, any>>(event: E, run: EventHandlerRun<E, Ctx>): Promise<void> => {
        const es = eventSubscribersMap[event.eventName]
        const eventHandler = EventHandler({
          event,
          run
        })

        if (es) {
          es.push(eventHandler)
        } else {
          eventSubscribersMap[event.eventName] = [eventHandler]
        }
      },
      subscribeHandler: async (eventHandler: EventHandler<Event<string, any>, Ctx>): Promise<void> => {
        const es = eventSubscribersMap[eventHandler.event.eventName]

        if (es) {
          es.push(eventHandler)
        } else {
          eventSubscribersMap[eventHandler.event.eventName] = [eventHandler]
        }

        return
      },
      ...transportAssignedEvents
    }
  }
}
