
import { useEffect, useState } from "react";

const GameListEntry = (
    game, hosting, editing, activeGame,
    
) => {

    return (
              <li className="game-item">
                <img src={game.image} alt={game.title} className="game-image" />
                <div className="game-info">
                  <h3 className="game-title">{game.title}</h3>
                  <p className="game-description">{game.description}</p>
                </div>

                <div className="delete-game">
                    <button className="delete-button"
                    >
                      <img height={"auto"} width={"20px"} src={"/trash.png"} alt={"User"}/>
                    </button>
                    <div id={"delete-confirm-" + game.id} className="delete-confirm hidden">
                        <div>
                            Are you sure you want to delete this game permanently?
                        </div>
                        <div>
                            <button className="delete-confirm-button">
                                Yes, Delete Permanently
                            </button>
                        </div>
                    </div>
                </div>

                { (hosting || editing) && activeGame === game.id ? (
                <div className="game-status-and-links">
                    <div className="game-status">
                        <div>
                         Status:
                        </div>
                        <div>
                        { status }
                        </div>
                    </div>
                    { status === "Running" ? (
                    <div className="game-links">
                        <button 
                            onClick={() => handleOpenGame(game) }
                            >
                            Open { editing ? "Editor" : "Game" }
                        </button>
                        <button
                            onClick={() => handleCopyLink(game) }
                            >
                            Copy Link
                        </button>
                    </div>
                        ) : (
                    <div className="game-links">
                        <button className="greyed-out">
                            Open { editing ? "Editor" : "Game" }
                        </button>
                        <button className="greyed-out">
                            Copy Link
                        </button>
                    </div>
                        )}
                </div>
                ) : "" }
                <div className="game-buttons">
                    { editing || (activeGame && activeGame !== game.id) ? (
                          <button
                            className="play-button greyed-out"
                          >
                            Host
                          </button>
                        ) : (
                          <button
                            className="play-button" 
                            onClick={() => handleHost(game)}
                          >
                                { !hosting ?
                                    "Host" : "Stop Hosting"
                                }
                          </button>
                         )
                    }

                    { (hosting || ( activeGame && activeGame !== game.id)) ? (
                          <button
                            className="edit-button greyed-out"
                          >
                            Edit
                        </button>
                        ) : (
                          <button
                            className="edit-button" 
                            onClick={() => handleEdit(game)}
                          >
                            { !editing ? 
                                "Edit" : "Stop Editor"
                            }
                          </button>
                        ) 
                    }
                </div>
              </li>



    );
};
export default GameListEntry;
