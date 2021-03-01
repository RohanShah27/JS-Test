import React, { Component } from "react";
import "../../assets/styles/player-index.css";
import playerImage from "../../assets/player-images/63706.jpg";
export default class Players extends Component {
  componentDidMount() {
    // Call the function to get player list from given API
    this.getPlayerData();
  }
  //initialie the state
  state = {
    playerList: [],
  };
  /**
   *@description Calls the given API endpoint to get the player data and then format it to display
   */
  getPlayerData = async () => {
    //init an empty player list array to store data coming from the endpoint
    let playerList = [];
    await fetch("https://api.npoint.io/d6bd0efc05639084eb17/")
      .then((response) => response.json())
      .then((data) => (playerList = data.playerList));
    //declare an empty array to store formatted player data
    let formattedList = [];
    //loop through the objects
    for (var i = 0; i < playerList.length; i++) {
      //init empty player object
      let playerObject = {};
      //assign values
      playerObject.PFName = playerList[i].PFName;
      playerObject.SkillDesc = playerList[i].SkillDesc;
      playerObject.Value = "$" + playerList[i].Value;
      playerObject.Id = playerList[i].Id;
      playerObject.UpcomingMatch = {
        teams:
          playerList[i].UpComingMatchesList[0].CCode +
          " vs " +
          playerList[i].UpComingMatchesList[0].VsCCode,
        time: playerList[i].UpComingMatchesList[0].MDate,
      };
      playerObject.TName = playerList[i].TName;
      //append the data in formatted list
      formattedList.push(playerObject);
    }
    //set the state with formatted data values
    this.setState({ ...this.state, playerList: formattedList });
  };

  /**
   * Checking if an image exist in your image folder
   */
  loadImage = (variable) => {
    var image = new Image();
    var url_image = "../../assets/player-images/" + variable + ".jpg";
    image.src = url_image;
    if (image.width === 0) {
      return <img src={require("../../assets/player-images/63706.jpg")} />;
    } else {
      return (
        <img src={require(`../../assets/player-images/${variable}.jpg`)} />
      );
    }
  };
  render() {
    return (
      <div className="main-container">
        <div className="player-grid">
          {/* map the players here */}
          {this.state.playerList
            //sort the player list in ascending order
            .sort((a, b) =>
              a.PFName.toLowerCase() < b.PFName.toLowerCase() ? -1 : 1
            )
            .map((player, index) => (
              <div className="player-card" key={`player-card-${index}`}>
                {/* player image container */}
                <div className="player-image">
                  <img src={playerImage} />
                </div>
                <div className="player-details">
                  <div className="name-skill">
                    <div>Name : {player.PFName}</div>
                    <div>Skill : {player.SkillDesc}</div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  }
}
