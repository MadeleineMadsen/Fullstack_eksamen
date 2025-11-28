import express, { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Movie } from '../entities/Movie';

const router = express.Router();

// GET /api/movies - Hent alle film (CRUD: Read)
router.get('/', async (req: Request, res: Response) => {
  try {
    const movies = await AppDataSource.getRepository(Movie).find();
    res.json(movies);
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/movies/:id - Hent specifik film (CRUD: Read)
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const movie = await AppDataSource.getRepository(Movie).findOne({
      where: { id: parseInt(id) }
    });

    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    res.json(movie);
  } catch (error) {
    console.error('Error fetching movie:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/movies - Opret ny film (CRUD: Create)
router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, overview, released, runtime, rating, background_image } = req.body;
    
    const movieRepository = AppDataSource.getRepository(Movie);

    const movie = movieRepository.create({
      title,
      overview,
      released,
      runtime,
      rating,
      background_image
    });

    const savedMovie = await movieRepository.save(movie);
    res.status(201).json(savedMovie);
  } catch (error) {
    console.error('Error creating movie:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/movies/:id - Opdater film (CRUD: Update)
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, overview, released, runtime, rating, background_image } = req.body;
    
    const movieRepository = AppDataSource.getRepository(Movie);
    
    // Tjek om film eksisterer
    const existingMovie = await movieRepository.findOne({
      where: { id: parseInt(id) }
    });

    if (!existingMovie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    // Opdater film
    await movieRepository.update(id, {
      title,
      overview,
      released,
      runtime,
      rating,
      background_image
    });

    // Hent den opdaterede film
    const updatedMovie = await movieRepository.findOne({ 
      where: { id: parseInt(id) } 
    });
    
    res.json(updatedMovie);
  } catch (error) {
    console.error('Error updating movie:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/movies/:id - Slet film (CRUD: Delete)
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const movieRepository = AppDataSource.getRepository(Movie);
    const movie = await movieRepository.findOne({
      where: { id: parseInt(id) }
    });

    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    await movieRepository.remove(movie);
    res.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    console.error('Error deleting movie:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;