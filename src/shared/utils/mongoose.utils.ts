import { Document, PopulateOptions, Query } from 'mongoose';

function genPopulatePath(nestedPaths: string[]): PopulateOptions {
	const [path, ...rest] = nestedPaths;
	return { path, ...(rest.length > 0 && { populate: genPopulatePath(rest) }) };
}

function handlePopulate<T, U extends Document, V>(model: Query<T, U, V>, populate: string): Query<T, U, V> {
	return model.populate(genPopulatePath(populate.split('.')));
}

export function multiPopulate<T, U extends Document, V>(
	model: Query<T, U, V>,
	populate: string[] | string,
	prefix = '',
): Query<T, U, V> {
	if (typeof populate === 'string') return handlePopulate(model, prefix ? prefix + '.' + populate : populate);

	return populate.reduce((acc, el) => handlePopulate(acc, prefix ? prefix + '.' + el : el), model);
}

function handlePopulateDoc<T, U, X extends Document<T, U>>(doc: X, populate: string): X {
	return doc.populate(genPopulatePath(populate.split('.')));
}

export function multiPopulateDoc<T, U, X extends Document<T, U>>(doc: X, populate: string[] | string, prefix = ''): X {
	if (typeof populate === 'string') return handlePopulateDoc(doc, prefix ? prefix + '.' + populate : populate);

	return populate.reduce((acc, el) => handlePopulateDoc(acc, prefix ? prefix + '.' + el : el), doc);
}
