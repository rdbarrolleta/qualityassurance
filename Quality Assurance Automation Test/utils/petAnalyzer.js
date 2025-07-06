// @ts-check

class PetAnalyzer {

    constructor(petData) {
        this.petData = petData;
    }

    countPetsBySameName() {
        const nameCounts = {}; 
        this.petData.forEach(pet => {
            const petName = String(pet.name).trim(); 
            if (petName !== "") { 
                nameCounts[petName] = (nameCounts[petName] || 0) + 1;
            }
        });
        return nameCounts;
    }
}

// Export the PetAnalyzer class so it can be imported by other files
module.exports = PetAnalyzer;
