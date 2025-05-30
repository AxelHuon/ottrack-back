import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { genereateSlug } from '../utils/slug';

@Injectable()
export class SlugService {
  constructor(private prisma: PrismaService) {}

  /**
   * Génère un slug unique en ajoutant un suffixe numérique si nécessaire.
   * @param baseSlug - Le slug de base généré (sans suffixe)
   * @param model - Le modèle dans lequel on cherche un slug (par exemple "room", "product", etc.)
   * @returns Le slug unique.
   */
  async generateUniqueSlug(baseSlug: string, model: string): Promise<string> {
    let slug = genereateSlug(baseSlug);

    let isSlugUnique = false;
    let counter = 1;

    // Recherche du slug existant dans la table correspondant au modèle
    while (!isSlugUnique) {
      // @ts-ignore
      const existingEntity = await this.prisma[model].findUnique({
        where: { slug },
      });

      if (!existingEntity) {
        isSlugUnique = true;
      } else {
        slug = `${genereateSlug(baseSlug)}-${counter}`;
        counter++;
      }
    }

    return slug;
  }
}
