import * as repository from "./desksRepository.js";

export function getDesks() {
	return repository.getAll();
}
