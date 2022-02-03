App = {
    web3Provider: null,
    contracts: {},
    account: '0x0',
    hasVoted: false,

    init: function() {
        return App.initWeb3();
    },

    initWeb3: function() {
        // TODO: refactor conditional
        if (typeof web3 !== 'undefined') {
            // If a web3 instance is already provided by Meta Mask.
            App.web3Provider = web3.currentProvider;
            web3 = new Web3(web3.currentProvider);
        } else {
            // Specify default instance if no web3 instance provided
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
            web3 = new Web3(App.web3Provider);
        }
        return App.initContract();
    },

    initContract: function() {
        $.getJSON("Election.json", function(election) {
            // Instantiate a new truffle contract from the artifact
            App.contracts.Election = TruffleContract(election);
            // Connect provider to interact with contract
            App.contracts.Election.setProvider(App.web3Provider);

            App.listenForEvents();

            return App.render();
        });
    },

    // Listen for events emitted from the contract
    listenForEvents: function() {
        App.contracts.Election.deployed().then(function(instance) {
            // Restart Chrome if you are unable to receive this event
            // This is a known issue with Metamask
            // https://github.com/MetaMask/metamask-extension/issues/2393
            instance.votedEvent({}, {
                fromBlock: 0,
                toBlock: 'latest'
            }).watch(function(error, event) {
                console.log("event triggered", event)
                    // Reload when a new vote is recorded
                App.render();
            });
        });
    },

    render: function() {
        var electionInstance;
        var loader = $("#loader");
        var content = $("#content");

        loader.show();
        content.hide();

        // Loading the account data
        web3.eth.getCoinbase(function(err, account) {
            if (err === null) {
                App.account = account;
                $("#accountAddress").html("My Account: " + account);
            }
        });

        // Loading the contract data
        App.contracts.Election.deployed().then(function(instance) {
            electionInstance = instance;
            return electionInstance.candidatesCount();
        }).then(function(candidatesCount) {
            var candidatesResults = $("#candidatesResults");
            candidatesResults.empty();

            var candidatesSelect = $('#candidatesSelect');
            candidatesSelect.empty();
            // const party_symbols = new Array("https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Bharatiya_Janata_Party_logo.svg/270px-Bharatiya_Janata_Party_logo.svg.png", "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Congresspartylogo%E2%80%A6.png/150px-Congresspartylogo%E2%80%A6.png", "BMW");
            let party_symbols = ["https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Bharatiya_Janata_Party_logo.svg/270px-Bharatiya_Janata_Party_logo.svg.png", "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Congresspartylogo%E2%80%A6.png/150px-Congresspartylogo%E2%80%A6.png", "https://upload.wikimedia.org/wikipedia/en/thumb/5/5e/Dravida_Munnetra_Kazhagam_logo.png/180px-Dravida_Munnetra_Kazhagam_logo.png", "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/All_India_Trinamool_Congress_logo_%281%29.svg/180px-All_India_Trinamool_Congress_logo_%281%29.svg.png", "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Symbol_of_YSR_Congress_Party.jpg/270px-Symbol_of_YSR_Congress_Party.jpg", "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Logo_of_Shiv_Sena.svg/270px-Logo_of_Shiv_Sena.svg.png", "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Janata_Dal_%28United%29_Flag.svg/300px-Janata_Dal_%28United%29_Flag.svg.png", "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Indian_Election_Symbol_Conch.svg/188px-Indian_Election_Symbol_Conch.svg.png", "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Elephant_Bahujan_Samaj_Party.svg/300px-Elephant_Bahujan_Samaj_Party.svg.png", "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Telangana_Rashtra_Samithi_symbol.svg/951px-Telangana_Rashtra_Samithi_symbol.svg.png"];

            for (var i = 1; i <= candidatesCount; i++) {
                electionInstance.candidates(i).then(function(candidate) {
                    var id = candidate[0];
                    var name = candidate[1];
                    var voteCount = candidate[2];

                    // Rendering all candidates results with their party symbols and IDS and their names
                    var img1 = document.createElement("img");
                    if (name == "Bharatiya Janata Party") {
                        // img1.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Bharatiya_Janata_Party_logo.svg/270px-Bharatiya_Janata_Party_logo.svg.png";
                        img1.src = party_symbols[0];
                        img1.style.width = "100px";
                        img1.style.height = "100px";
                        var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>"
                        candidatesResults.append(candidateTemplate);
                        document.getElementById("candidatesResults").appendChild(img1);
                    } else if (name == "Indian National Congress") {
                        // img1.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Bharatiya_Janata_Party_logo.svg/270px-Bharatiya_Janata_Party_logo.svg.png";
                        img1.src = party_symbols[1];
                        img1.style.width = "100px";
                        img1.style.height = "100px";
                        var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>"
                        candidatesResults.append(candidateTemplate);
                        document.getElementById("candidatesResults").appendChild(img1);
                    } else if (name == "Dravida Munnetra Kazhagam") {
                        // img1.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Bharatiya_Janata_Party_logo.svg/270px-Bharatiya_Janata_Party_logo.svg.png";
                        img1.src = party_symbols[2];
                        img1.style.width = "100px";
                        img1.style.height = "100px";
                        var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>"
                        candidatesResults.append(candidateTemplate);
                        document.getElementById("candidatesResults").appendChild(img1);
                    } else if (name == "Dravida Munnetra Kazhagam") {
                        // img1.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Bharatiya_Janata_Party_logo.svg/270px-Bharatiya_Janata_Party_logo.svg.png";
                        img1.src = party_symbols[2];
                        img1.style.width = "100px";
                        img1.style.height = "100px";
                        var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>"
                        candidatesResults.append(candidateTemplate);
                        document.getElementById("candidatesResults").appendChild(img1);
                    } else if (name == "All India Trinamool Congress") {
                        // img1.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Bharatiya_Janata_Party_logo.svg/270px-Bharatiya_Janata_Party_logo.svg.png";
                        img1.src = party_symbols[3];
                        img1.style.width = "100px";
                        img1.style.height = "100px";
                        var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>"
                        candidatesResults.append(candidateTemplate);
                        document.getElementById("candidatesResults").appendChild(img1);
                    } else if (name == "Yuvajana Sramika Rythu Congress Party") {
                        // img1.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Bharatiya_Janata_Party_logo.svg/270px-Bharatiya_Janata_Party_logo.svg.png";
                        img1.src = party_symbols[4];
                        img1.style.width = "100px";
                        img1.style.height = "100px";
                        var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>"
                        candidatesResults.append(candidateTemplate);
                        document.getElementById("candidatesResults").appendChild(img1);
                    } else if (name == "Shiv Sena") {
                        // img1.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Bharatiya_Janata_Party_logo.svg/270px-Bharatiya_Janata_Party_logo.svg.png";
                        img1.src = party_symbols[5];
                        img1.style.width = "100px";
                        img1.style.height = "100px";
                        var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>"
                        candidatesResults.append(candidateTemplate);
                        document.getElementById("candidatesResults").appendChild(img1);
                    } else if (name == "Janata Dal (United)") {
                        // img1.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Bharatiya_Janata_Party_logo.svg/270px-Bharatiya_Janata_Party_logo.svg.png";
                        img1.src = party_symbols[6];
                        img1.style.width = "100px";
                        img1.style.height = "100px";
                        var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>"
                        candidatesResults.append(candidateTemplate);
                        document.getElementById("candidatesResults").appendChild(img1);
                    } else if (name == "Biju Janata Dal") {
                        // img1.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Bharatiya_Janata_Party_logo.svg/270px-Bharatiya_Janata_Party_logo.svg.png";
                        img1.src = party_symbols[7];
                        img1.style.width = "100px";
                        img1.style.height = "100px";
                        var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>"
                        candidatesResults.append(candidateTemplate);
                        document.getElementById("candidatesResults").appendChild(img1);
                    } else if (name == "Biju Janata Dal") {
                        // img1.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Bharatiya_Janata_Party_logo.svg/270px-Bharatiya_Janata_Party_logo.svg.png";
                        img1.src = party_symbols[7];
                        img1.style.width = "100px";
                        img1.style.height = "100px";
                        var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>"
                        candidatesResults.append(candidateTemplate);
                        document.getElementById("candidatesResults").appendChild(img1);
                    } else if (name == "Biju Janata Dal") {
                        // img1.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Bharatiya_Janata_Party_logo.svg/270px-Bharatiya_Janata_Party_logo.svg.png";
                        img1.src = party_symbols[7];
                        img1.style.width = "100px";
                        img1.style.height = "100px";
                        var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>"
                        candidatesResults.append(candidateTemplate);
                        document.getElementById("candidatesResults").appendChild(img1);
                    } else if (name == "Bahujan Samaj Party") {
                        // img1.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Bharatiya_Janata_Party_logo.svg/270px-Bharatiya_Janata_Party_logo.svg.png";
                        img1.src = party_symbols[8];
                        img1.style.width = "100px";
                        img1.style.height = "100px";
                        var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>"
                        candidatesResults.append(candidateTemplate);
                        document.getElementById("candidatesResults").appendChild(img1);
                    } else if (name == "Telangana Rashtra Samithi") {
                        // img1.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Bharatiya_Janata_Party_logo.svg/270px-Bharatiya_Janata_Party_logo.svg.png";
                        img1.src = party_symbols[9];
                        img1.style.width = "100px";
                        img1.style.height = "100px";
                        var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>"
                        candidatesResults.append(candidateTemplate);
                        document.getElementById("candidatesResults").appendChild(img1);
                    } else {
                        var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>"
                        candidatesResults.append(candidateTemplate);
                    }


                    // Rendering the candidates ballot option for the voter to choose the supporting party
                    // document.getElementById("candidatesResults").appendChild(img1);
                    var candidateOption = "<option value='" + id + "' >" + name + "</ option>"
                    candidatesSelect.append(candidateOption);
                });
            }
            return electionInstance.voters(App.account);
        }).then(function(hasVoted) {
            // Do not allow a user to vote
            if (hasVoted) {
                $('form').hide();
            }
            loader.hide();
            content.show();
        }).catch(function(error) {
            console.warn(error);
        });
    },

    castVote: function() {
        var candidateId = $('#candidatesSelect').val();
        App.contracts.Election.deployed().then(function(instance) {
            return instance.vote(candidateId, { from: App.account });
        }).then(function(result) {
            // Wait for votes to update
            $("#content").hide();
            $("#loader").show();
        }).catch(function(err) {
            console.error(err);
        });
    }
};

$(function() {
    $(window).load(function() {
        App.init();
    });
});