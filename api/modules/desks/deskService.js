import * as repository from "./desksRepository.js";

export async function getDesks() {
	return await repository.getAll();
}
