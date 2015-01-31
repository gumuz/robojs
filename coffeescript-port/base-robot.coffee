class BaseRobot
    constructor: (@name="base-robot") ->
        @event_counter = 0
        @callbacks = {}
        self.onmessage = (e) =>
            @receive(e.data)
            
        @_run()


    move_forwards: (distance, callback) ->
        @send({
            "action": "move_forwards",
            "amount": distance
        }, callback)
    move_backwards: (distance, callback) ->
        @send({
            "action": "move_backwards",
            "amount": distance
        }, callback)
    turn_left: (angle, callback) ->
        @send({
            "action": "turn_left",
            "amount": angle
        }, callback)
    turn_right: (angle, callback) ->
        @send({
            "action": "turn_right",
            "amount": angle
        }, callback)


    receive: (msg) ->
        msg_obj = JSON.parse(msg)

        switch msg_obj["action"]
            when "callback"
                if typeof @callbacks[msg_obj["event_id"]] is "function"
                    @callbacks[msg_obj["event_id"]]()
            when "update"
                #@run()
                1+1

    _run: ->
        setTimeout(=>
            @run()
        , 0)
    run: ->
        throw "You need to implement the run() method"

    update: ->
        # empty, to be overidden

    send: (msg_obj, callback) ->
        event_id = @event_counter++
        @callbacks[event_id] = callback
        msg_obj["event_id"] = event_id
        postMessage(JSON.stringify(msg_obj))


@BaseRobot = BaseRobot
