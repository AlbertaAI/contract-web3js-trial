var account = $('#accountAddress').text();
var balance = 0;
var chosenTokenNumber = document.getElementById("tokenOutputNumber").value;
$('#myRange').on('change', function(){
    chosenTokenNumber = $(this).val();
});
var BigNumber = require('bignumber.js');

App = {
    web3Provider: null,
    contracts: {},

    init: function() {
        return App.initWeb3();
    },

    initWeb3: function() {
        // Is there an injected web3 instance?
        if (typeof web3 !== 'undefined') {
            App.web3Provider = web3.currentProvider;
        } else {
            // If no injected web3 instance is detected, fall back to Ganache
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        }
        web3 = new Web3(App.web3Provider);

        return App.initContract();
    },

    initContract: function() {

        $.getJSON('Token.json', function(data) {
            // Get the necessary contract artifact file and instantiate it with truffle-contract
            var TokenArtifact = data;

            App.contracts.Token = TruffleContract(TokenArtifact);

            // Set the provider for our contract
            App.contracts.Token.setProvider(App.web3Provider);

            // Use our contract to retrieve and mark the adopted pets
            return App.readBalance(account);

            App.Approval ().watch ( (err, response) => {  //set up listener for the AuctionClosed Event
              //once the event has been detected, take actions as desired
              App.readBalance(account)
            });

            App.Transfer ().watch ( (err, response) => {  //set up listener for the AuctionClosed Event
              //once the event has been detected, take actions as desired
              App.readBalance(account)
            });
        });

        return App.bindEvents();
    },

    bindEvents: function() {
        $(document).on('click', '.transferFunds', App.handleTransfer);
    },

    readBalance: function() {
        // App.balanceOf(account, (err, tkns) => {
        //     if (!err) {
        //         balance = web3.fromWei(tkns, 'ether').toNumber()
        //         $('#balance').text() = balance
        //     }
        //     console.log(err)
        // })
        App.balanceOf(account, (err, tkns) => {
            if (!err) {
                balance = web3.fromWei(tkns, 'ether').toNumber()
                $('#balance').text() = balance
            }
            console.log(err)
        })
    },

    //sending Tokens

    transferFunds: function() {
        App.transfer(account, web3.toWei(chosenTokenNumber, 'ether'), (err, res) => {
            if (!err) {
                console.log(res)
                return
            }
            console.log(err)
        })
    }

};

$(function() {
    $(window).load(function() {
        App.init();
    });
});
