// adapters/5eToolsAdapter.ts
import { Species2024, Background2024, Class2024, AbilityScoreName } from '../types/character';

// Utility to clean 5e.tools markup tags (e.g. {@feat Tough|XPHB} -> Tough)
export function parse5eToolsText(input: string = ''): string {
  return input
    .replace(/\{@\w+\s+([^|}]+)[^}]*\}/g, '$1')
    .replace(/\{@dice\s+([^}]+)\}/g, '$1');
}

export class FiveEToolsAdapter {
  private static VALID_SOURCES = new Set(['XPHB', "PHB'24", 'PHB24']);

  /**
   * Adapts raw 5e.tools race/species entries into unified Species2024 array
   */
  public static adaptSpeciesList(rawRaces: any[]): Species2024[] {
    return rawRaces
      .filter((race) => this.VALID_SOURCES.has(race.source))
      .map((race) => {
        const traits = (race.entries || [])
          .filter((e: any) => typeof e === 'object' && e.name)
          .map((e: any) => ({
            name: e.name,
            description: Array.isArray(e.entries)
              ? e.entries.map((entry: any) => (typeof entry === 'string' ? parse5eToolsText(entry) : '')).join(' ')
              : parse5eToolsText(e.entries || ''),
          }));

        return {
          id: `${race.name.toLowerCase().replace(/\s+/g, '-')}-${race.source.toLowerCase()}`,
          name: race.name,
          source: race.source,
          speed: typeof race.speed === 'number' ? race.speed : race.speed?.walk || 30,
          sizeOptions: race.size || ['Medium'],
          traits,
        };
      });
  }

  /**
   * Adapts 2024 Backgrounds (handling +3 ability boosts, Origin Feats, & starting equipment)
   */
  public static adaptBackgroundList(rawBackgrounds: any[]): Background2024[] {
    return rawBackgrounds
      .filter((bg) => this.VALID_SOURCES.has(bg.source))
      .map((bg) => {
        // Parse skills granted
        const skillProficiencies = bg.skills
          ? bg.skills.flatMap((s: any) => Object.keys(s))
          : [];

        // Extract origin feat reference from entries or dedicated feat object
        let originFeatName = 'Custom Origin Feat';
        if (bg.feats) {
          const featKey = Object.keys(bg.feats[0] || {})[0];
          if (featKey) originFeatName = parse5eToolsText(featKey);
        }

        return {
          id: `${bg.name.toLowerCase().replace(/\s+/g, '-')}-${bg.source.toLowerCase()}`,
          name: bg.name,
          source: bg.source,
          recommendedAbilityScores: bg.ability ? Object.keys(bg.ability[0]) as AbilityScoreName[] : ['str', 'dex', 'con'],
          originFeatId: originFeatName.toLowerCase().replace(/\s+/g, '-'),
          originFeatName,
          skillProficiencies,
          toolProficiencies: bg.tools ? bg.tools.map((t: any) => parse5eToolsText(Object.keys(t)[0])) : [],
          startingEquipmentChoice: {
            presetItems: bg.equipment ? bg.equipment.map((e: any) => ({ itemName: e.item || 'Item', quantity: e.count || 1 })) : [],
            goldAlternative: 50,
          },
        };
      });
  }
}