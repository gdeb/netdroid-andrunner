/*jslint node: true */
'use strict';

let EventEmitter = require('events').EventEmitter,
    expect = require('expect.js'),
    properties = require('../es5-src/framework/properties.js');

let ValueProperty = properties.ValueProperty,
    ListProperty = properties.ListProperty,
    ListDictProperty = properties.ListDictProperty;

//-----------------------------------------------------------------------------
describe('ValueProperty', function () {

    it('should set an initial value', function () {
        var prop = new ValueProperty(null, null, 'stephane');
        expect(prop.get()).to.be('stephane');
    });

    it('should set a value', function () {
        var prop = new ValueProperty(null, new EventEmitter());
        expect(prop.get()).to.be(undefined);
        prop.set('stephane');
        expect(prop.get()).to.be('stephane');
    });

    it('should emit changes', function (done) {
        var model = new EventEmitter();

        model.on('name:change', function (event) {
            expect(event).to.eql({
                type:'change',
                new_value: 'xavier',
                old_value: 'stephane',
            });
            done();            
        });
        var prop = new ValueProperty('name', model, 'stephane');
        prop.set('xavier');
    });
});

//-----------------------------------------------------------------------------
function make_names () {
    return new ListProperty('names', new EventEmitter(), ['stephane', 'xavier']);
}

function make_numbers () {
    return new ListProperty('numbers', new EventEmitter(), [4,3,12,2,24]);
}

describe('ListProperty', function () {
    it('should set an initial value', function () {
        var names = make_names();
        expect(names.get()).to.eql(['stephane', 'xavier']);
    });

    it('should refuse non list as initial value', function () {
        expect(function () {
            new ListProperty('names', new EventEmitter(), 'stephane');
        }).to.throwError();
    });

    it('should be gettable by index', function () {
        var names = make_names();
        expect(names.get(1)).to.be('xavier');
    });

    it('should return a copy of the list when getted', function () {
        var names = make_names();
        names.get()[0] = 'george';
        expect(names.get()).to.eql(['stephane', 'xavier']);        
    });

    it('should return the length of the list', function () {
        var names = make_names();
        expect(names.length).to.be(2);
    });

    it('should be safe if wrong index are used', function () {
        var names = make_names();
        expect(names.get(2)).to.be(undefined);
    });

    it('should be settable', function () {
        var names = make_names();
        names.set(1,'raphael');
        expect(names.get(1)).to.be('raphael');
    });

    it('should check boundaries when setting values', function () {
        var names = make_names();
        expect(function () {
            names.set(2, 'raphael');
        }).to.throwError();
    });  

    it('should add elements', function () {
        var names = make_names();
        names.add('raphael', 'simon');
        expect(names.get()).to.eql(['stephane','xavier','raphael', 'simon']);
    });

    it('should find elements', function () {
        var names = make_names();
        expect(names.find(function (n) { 
            return n[1] === 'a';
        })).to.be('xavier');
    });

    it('should find all elements', function () {
        var names = make_names();
        expect(names.findAll(function (n) { 
            return n[1] === 'a';
        })).to.eql(['xavier']);
    });

    it('should remove elements', function () {
        var names = make_names();
        names.remove(0);
        expect(names.get()).to.eql(['xavier']);
    });

    it('should not remove if index out of bounds', function () {
        var names = make_names();
        expect(function () {
            names.remove(2);
        }).to.throwError();
    });

    it('should remove elements by index', function () {
        var numbers = make_numbers();
        numbers.remove(function (n) { return n <= 6});
        expect(numbers.get()).to.eql([12, 24])
    });

    it('should reset elements', function () {
        var numbers = make_numbers();
        numbers.reset('stephane', 'xavier');
        expect(numbers.get()).to.eql(['stephane','xavier']);
    });
});


//-----------------------------------------------------------------------------
function make_players () {
    return new ListDictProperty('players', new EventEmitter(), [
        {name:'stephane', faction: 'runner'}, 
        {name:'xavier', faction: 'corp'}
    ]);
}

describe('ListDictProperty', function () {
    it('should set an initial value', function () {
        var players = make_players();
        expect(players.get()).to.eql([
            {name:'stephane', faction: 'runner'}, 
            {name:'xavier', faction: 'corp'}
        ]);
    });

    it('should return a copy of an elem', function () {
        var player1 = {name:'stephane', faction: 'runner'};
        var player2 = {name:'xavier', faction: 'corp'};
        var players = new ListDictProperty(function () {}, [player1]);
        players.add(player2)
        expect(players.get(0)).not.to.be(player1);
        expect(players.get(1)).not.to.be(player2);
    });

    it('should be gettable by index and attribute', function () {
        var players = make_players();
        expect(players.get(1)).to.eql({name:'xavier', faction: 'corp'});
        expect(players.get(1, 'faction')).to.be('corp');
    });

    it('should refuse index out of bound when get(ind, attr)', function () {
        var players = make_players();
        expect(function () {
            players.get(2, 'faction');
        }).to.throwError();
    });

    it('should have a length property', function () {
        var players = make_players();
        expect(players.length).to.be(2);
    });

    it('should be settable (by attribute)', function () {
        var players = make_players();
        players.set(1, {name: 'simon', faction: 'runner'});
        players.set(0, 'faction', 'corp');
        expect(players.get()).to.eql([
            {name:'stephane', faction: 'corp'},
            {name:'simon', faction:'runner'}
        ]);
    });

    it('should be able to add elements', function () {
        var players = make_players();
        players.add({name:'simon'}, {name:'richard'});
        expect(players.get()).to.eql([
            {name:'stephane', faction: 'runner'}, 
            {name:'xavier', faction: 'corp'},
            {name:'simon'}, {name: 'richard'}
        ]);
    });

    it('should remove elements by index', function () {
        var players = make_players();
        players.remove(0);
        expect(players.get()).to.eql([{name: 'xavier', faction: 'corp'}]);
    });

    it('should remove elements by predicate', function () {
        var players = make_players();
        players.remove(function (p) {return p.faction === 'corp'});
        expect(players.get()).to.eql([{
            name: 'stephane',
            faction: 'runner',
        }]);
    });

    it('should remove elems by object comparison', function () {
        var players = make_players();
        players.remove({faction: 'corp'});
        expect(players.get()).to.eql([{
            name: 'stephane',
            faction: 'runner',
        }]);
    });
});
