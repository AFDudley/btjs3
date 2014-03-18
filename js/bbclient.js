function register_models(eq) {
    eq.Models.World = Backbone.Model.extend({
        url: '/api',
        rpc: new Backbone.Rpc(),
        idAttribute: 'uid',
        methods: {
            read: ['info.world', 'uid'],
        },
        initialize: function() {
            _.bindAll(this, 'fetch_success');
            this.bind('change', this.fetch_success);
        },
        fetch_success: function() {
            this.fields = new eq.Collections.Fields(this.get('visible_fields'));
            this.uid = this.get('uid');
        },
    });

    eq.Models.WorldClock = Backbone.Model.extend({
        url: '/api',
        rpc: new Backbone.Rpc(),
        methods: {
            read: ['info.clock', 'uid'],
        },
        initialize: function() {
            _.bindAll(this, 'fetch_success');
            this.bind('change', this.fetch_success);
        },
        fetch_success: function() {
            this.dob = this.get('dob');
            this.elapsed = this.get('elapsed');
            this.state = this.get('state');
        },
    });

    eq.Models.FieldClock = Backbone.Model.extend({
        initialize: function() {
            _.bindAll(this, 'fetch_success');
            this.bind('change', this.fetch_success);
        },
        fetch_success: function() {
            this.season = this.get('season');
        },
    });

    eq.Models.Field = Backbone.Model.extend({
        url: '/api',
        rpc: new Backbone.Rpc(),
        methods: {
            read: ['info.field', 'uid', 'loc'],
        },
        initialize: function() {
            _.bindAll(this, 'fetch_success');
            this.bind('change', this.fetch_success);
        },
        fetch_success: function() {
            this.loc = this.get('coordinate');
            this.owner = new eq.Models.Player(this.get('owner'));
            this.element = this.get('element');
            this.clock = new eq.Models.FieldClock(this.get('clock'));
            // TODO -- this needs to be ordered by queue pos -- if
            // collections are unordered, need something to work around that
            this.queue = new eq.Collections.Squads(this.get('queue'));
            this.battle = new eq.Models.Battle(this.get('battle'));
        },
    });

    eq.Models.Battle = Backbone.Model.extend({
        url: '/api',
        rpc: new Backbone.Rpc(),
        idAttribute: 'uid',
        methods: {
            read: ['info.battle', 'uid'],
        },
        initialize: function() {
            _.bindAll(this, 'fetch_success');
            this.bind('change', this.fetch_success);
        },
        fetch_success: function() {
            this.uid = this.get('uid');
            this.timer = new eq.Models.BattleTimer(this.get('timer'));
            this.defender = new eq.Models.Squad(this.get('defender'));
            this.attacker = new eq.Models.Squad(this.get('attacker'));
            this.action_num = this.get('action_num');
            this.game_over = this.get('game_over');
            this.winner = new eq.Models.Player(this.get('winner'));
        }
    });

    eq.Models.BattleTimer = Backbone.Model.extend({
        url: '/api',
        rpc: new Backbone.Rpc(),
        methods: {
            read: ['info.battle_timer', 'uid'],
        },
        initialize: function() {
            _.bindAll(this, 'fetch_success');
            this.bind('change', this.fetch_success);
        },
        fetch_success: function() {
            this.start_time = this.get('start_time');
            this.action_num = this.get('action_num');
            this.current_ply = this.get('current_ply');
            // TODO -- convert uid to a real model?
            this.current_unit = new eq.Models.Unit(this.get('current_unit'));
            this.time_remaining = this.get('time_remaining');
        }
    });

    eq.Models.Stronghold = Backbone.Model.extend({
        url: '/api',
        rpc: new Backbone.Rpc(),
        methods: {
            read: ['info.stronghold', 'uid', 'loc'],
        },
        initialize: function() {
            _.bindAll(this, 'fetch_success');
            this.bind('change', this.fetch_success);
        },
        fetch_success: function() {
            this.field = this.get('field'); // TODO -- map to Field? (backref)
            this.silo = new eq.Models.Stone(this.get('silo'));
            this.weapons = new eq.Collections.Weapons(this.get('weapons'));
            this.free = new eq.Collections.Units(this.get('free'));
            this.squads = new eq.Collections.Squads(this.get('squads'));
            this.defenders = new eq.Collections.Squad(this.get('defenders'));
        }
    });

    eq.Models.Unit = Backbone.Model.extend({
        url: '/api',
        rpc: new Backbone.Rpc(),
        methods: {
            read: ['info.unit', 'uid'],
        },
        idAttribute: 'uid',
        initialize: function() {
            _.bindAll(this, 'fetch_success');
            this.bind('change', this.fetch_success);
        },
        fetch_success: function() {
            this.uid = this.get('uid');
            this.comp = this.get('comp');
            this.element = this.get('element');
            this.name = this.get('name');
            this.location = this.get('location');
            this.sex = this.get('sex');
            this.dob = this.get('dob');
            this.dod = this.get('dod');
            this.chosen_location = this.get('chosen_location');
        }
    });

    eq.Models.Weapon = Backbone.Model.extend({
        initialize: function() {
            _.bindAll(this, 'fetch_success');
            this.bind('change', this.fetch_success);
        },
        fetch_success: function() {
            this.type = this.get('type');
            this.element = this.get('element');
            this.comp = this.get('comp');
            this.stronghold = this.get('stronghold'); // TODO -- map to stronghold (backref)?
            this.stronghold_pos = this.get('stronghold_pos');
        },
    });

    eq.Models.Player = Backbone.Model.extend({
        // url: '/api',
        // rpc: new Backbone.Rpc(),
        idAttribute: 'uid',
        initialize: function() {
            _.bindAll(this, 'fetch_success');
            this.bind('change', this.fetch_success);
        },
        fetch_success: function() {
            this.username = this.get('username');
            this.email = this.get('email');
            this.uid = this.get('uid');
            // TODO -- this is only in 'combatant' view, the squad is context
            // dependent
            this.squad = this.get('squad'); // TODO -- map to Squads collection?
        }
    });

    eq.Models.Stone = Backbone.Model.extend({
        initialize: function() {
            _.bindAll(this, 'fetch_success');
            this.bind('change', this.fetch_success);
        },
        fetch_success: function() {
            this.limit = this.get('limit');
            this.comp = this.get('comp');
        }
    });

    eq.Models.Squad = Backbone.Model.extend({
        initialize: function() {
            _.bindAll(this, 'fetch_success');
            this.bind('change', this.fetch_success);
        },
        fetch_success: function() {
            this.name = this.get('name');
            this.units = new eq.Collections.Units(this.get('units'));
            this.stronghold = this.get('stronghold'); // TODO -- map to Stronghold (backref)?
            this.stronghold_pos = this.get('stronghold_pos');
            this.queued_field = this.get('queued_field'); // TODO -- map to Field (backref)?
        }
    });

    eq.Models.Vestibule = Backbone.Model.extend({
        url: '/api',
        rpc: new Backbone.Rpc();
        idAttribute: 'uid',
        methods: {
            read: ['vestibule.get', 'uid'],
            join: ['vestibule.join', 'uid'],
            create: ['vestibule.create'],
            leave: ['vestibule.leave'],
            start: ['vestibule.start'],
        },
        initialize: function() {
            _.bindAll(this, 'fetch_success');
            this.bind('change', this.fetch_success);
        },
        fetch_success: function() {
            this.uid = this.get('uid');
            this.players = new eq.Models.Players(this.get('players'));
        },
    });
}

function register_collections(eq) {
    function make_coll(m) {
        return Backbone.Collection.extend({
            model: m,
        });
    }

    eq.Collections.Units = make_coll(eq.Models.Unit);
    eq.Collections.Fields = make_coll(eq.Models.Fields);
    eq.Collections.Worlds = make_coll(eq.Models.World);
    eq.Collections.Squads = make_coll(eq.Models.Squad);
    eq.Collections.Weapons = make_coll(eq.Models.Weapon);
}

(function() {
    window.eq = {
        Models: {},
        Collections: {},
        Views: {},
    };

    register_models(eq);
    register_collections(eq);

}());
