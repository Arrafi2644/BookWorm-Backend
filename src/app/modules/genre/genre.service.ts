import httpStatus from 'http-status-codes';
import { IGenre } from "./genre.interface";
import AppError from '../../errorHelpers/appError';
import { Genre } from './genre.model';
import { QueryBuilder } from '../../utils/QueryBuilder';
import { genreSearchableFields } from './genre.constants';

const createGenre = async (payload: Partial<IGenre>) => {
    const { name } = payload;

    const isExistGenre = await Genre.findOne({ name });

    if (isExistGenre) {
        throw new AppError(httpStatus.CONFLICT, "Genre already exists");
    }

    const genre = await Genre.create(payload);

    return genre;
};

const getAllGenres = async (query: Record<string, string>) => {
    const queryBuilder = new QueryBuilder(Genre.find(), query);
    
    const genresData = queryBuilder
        .filter()
        .search(genreSearchableFields)
        .sort()
        .fields()
        .paginate();

    const [data, meta] = await Promise.all([
        genresData.build(),
        queryBuilder.getMeta()
    ]);

    return {
        data,
        meta
    };
};

const getSingleGenre = async (id: string) => {
    const genre = await Genre.findById(id);
    if (!genre) {
        throw new AppError(httpStatus.NOT_FOUND, "Genre Not Found");
    }
    return {
        data: genre
    }
};

const updateGenre = async (id: string, payload: Partial<IGenre>) => {
    const existingGenre = await Genre.findById(id);
    if (!existingGenre) {
        throw new AppError(httpStatus.NOT_FOUND, "Genre not found");
    }

    const updatedGenre = await Genre.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });

    return updatedGenre;
};

const deleteGenre = async (id: string) => {
    const genre = await Genre.findById(id);
    if (!genre) {
        throw new AppError(httpStatus.NOT_FOUND, "Genre Not Found");
    }
     
    await Genre.findByIdAndDelete(id);
    
    return {
        data: null
    }
};

export const GenreServices = {
    createGenre,
    getAllGenres,
    getSingleGenre,
    updateGenre,
    deleteGenre,
};
