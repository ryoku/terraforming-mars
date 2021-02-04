import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {setCustomGameOptions} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {CosmicRadiation} from '../../../src/cards/moon/CosmicRadiation';
import {expect} from 'chai';
import {MoonExpansion} from '../../../src/moon/MoonExpansion';
import {IMoonData} from '../../../src/moon/IMoonData';
import {TileType} from '../../../src/TileType';

const MOON_OPTIONS = setCustomGameOptions({moonExpansion: true});

describe('CosmicRadiation', () => {
  let player1: Player;
  let player2: Player;
  let player3: Player;
  let card: CosmicRadiation;
  let moonData: IMoonData;

  beforeEach(() => {
    player1 = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    player3 = TestPlayers.YELLOW.newPlayer();
    const game = Game.newInstance('id', [player1, player2, player3], player1, MOON_OPTIONS);
    card = new CosmicRadiation();
    moonData = MoonExpansion.moonData(game);
  });

  it('can play', () => {
    player1.cardsInHand = [card];
    player1.megaCredits = card.cost;

    moonData.miningRate = 4;
    expect(player1.getPlayableCards()).does.include(card);

    moonData.miningRate = 3;
    expect(player1.getPlayableCards()).does.not.include(card);
  });

  it('play', () => {
    const spaces = moonData.moon.getAvailableSpacesOnLand();

    const assignTile = function(idx: number, player: Player) {
      spaces[idx].tile = {tileType: TileType.MOON_MINE};
      spaces[idx].player = player;
    };

    assignTile(0, player1);
    player1.megaCredits = 10;

    assignTile(1, player2);
    assignTile(2, player2);
    player2.megaCredits = 3;

    assignTile(3, player3);
    assignTile(4, player3);
    assignTile(5, player3);
    player3.megaCredits = 20;

    card.play(player1);

    expect(player1.megaCredits).eq(6);
    expect(player2.megaCredits).eq(0);
    expect(player3.megaCredits).eq(8);
  });
});

