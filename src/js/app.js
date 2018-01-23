App = {
    web3Provider: null,
    contracts: {},

    init: function() {
        // Load pets.
        // $.getJSON('../pets.json', function(data) {
        //   var petsRow = $('#petsRow');
        //   var petTemplate = $('#petTemplate');
        //
        //   for (i = 0; i < data.length; i ++) {
        //     petTemplate.find('.panel-title').text(data[i].name);
        //     petTemplate.find('img').attr('src', data[i].picture);
        //     petTemplate.find('.pet-breed').text(data[i].breed);
        //     petTemplate.find('.pet-age').text(data[i].age);
        //     petTemplate.find('.pet-location').text(data[i].location);
        //     petTemplate.find('.btn-adopt').attr('data-id', data[i].id);
        //
        //     petsRow.append(petTemplate.html());
        //   }
        // ERC20
        var accountAddress = $('#accountAddress').text();
        var chosenTokenNumber = document.getElementById("tokenOutputNumber").value;
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
        // $.getJSON('Adoption.json', function(data) {
        //   // Get the necessary contract artifact file and instantiate it with truffle-contract
        //   var AdoptionArtifact = data;
        //   App.contracts.Adoption = TruffleContract(AdoptionArtifact);
        //
        //   // Set the provider for our contract
        //   App.contracts.Adoption.setProvider(App.web3Provider);
        //
        //   // Use our contract to retrieve and mark the adopted pets
        //   return App.markAdopted();
        // });

        $.getJSON('Token.json', function(data) {
            // Get the necessary contract artifact file and instantiate it with truffle-contract
            var TokenArtifact = data;
            App.contracts.Token = TruffleContract(TokenArtifact);

            // Set the provider for our contract
            App.contracts.Token.setProvider(App.web3Provider);

            // Use our contract to retrieve and mark the adopted pets
            return App.readBalance();
        });

        return App.bindEvents();
    },

    bindEvents: function() {
        $(document).on('click', '.transferFunds', App.handleTransfer);
    },

    readBalance: function() {
        var contractInstance;
        App.contracts.Token.deployed().then(function(instance) {
            contractInstance = instance;

            return contractInstance.balanceOf.call();
        }).then(function() {
            var balance = balanceOf(accountAddress);
            $("#balance").text() = balance;
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    transferFunds: function() {
        const abi = [{
            "constant": false,
            "inputs": [{
                    "name": "_to",
                    "type": "address"
                },
                {
                    "name": "_value",
                    "type": "uint256"
                }
            ],
            "name": "transfer",
            "outputs": [{
                "name": "success",
                "type": "bool"
            }],
            "payable": false,
            "type": "function"
        }]
        const address = '0xdeadbeef123456789000000000000'

        const MiniToken = contract(abi)
        const miniToken = MiniToken.at(address)
        var button = document.querySelector('button.transferFunds')
        button.addEventListener('click', function() {
            miniToken.transfer(toAddress, value, {
                    from: addr
                })
                .then(function(txHash) {
                    console.log('Transaction sent')
                    console.dir(txHash)
                    waitForTxToBeMined(txHash)
                })
                .catch(console.error)
        })
    }

};

$(function() {
    $(window).load(function() {
        App.init();
    });
});
