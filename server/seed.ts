import { storage } from "./storage";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // Create 5 workers
    const workers = [];
    for (let i = 1; i <= 5; i++) {
      const passwordHash = await bcrypt.hash("password123", 10);
      const worker = await storage.createUser({
        firstName: ["Alex", "Jamie", "Sam", "Morgan", "Casey"][i - 1],
        lastName: ["Chen", "Smith", "Johnson", "Williams", "Brown"][i - 1],
        age: 18 + i,
        email: `worker${i}@quicktask.com`,
        passwordHash,
        phone: `+33 6 ${10 + i}0 00 00 ${10 + i}`,
        photoUrl: `/attached_assets/generated_images/young_smiling_user_avatar_${i % 2 === 0 ? 1 : 2}.png`,
        bio: `Étudiant motivé prêt à aider sur des missions variées !`,
        locationLat: 48.8566 + (Math.random() * 0.1 - 0.05),
        locationLng: 2.3522 + (Math.random() * 0.1 - 0.05),
        skills: ["Aide ménagère", "Livraison", "Jardinage"].slice(0, i % 3 + 1),
      });
      workers.push(worker);
      console.log(`✅ Created worker: ${worker.firstName} ${worker.lastName}`);
    }

    // Create 3 clients
    const clients = [];
    for (let i = 1; i <= 3; i++) {
      const passwordHash = await bcrypt.hash("password123", 10);
      const client = await storage.createClient({
        userType: i === 1 ? "individual" : "company",
        companyName: i === 1 ? null : ["Tech Startup", "Local Shop"][i - 2],
        email: `client${i}@quicktask.com`,
        passwordHash,
        phone: `+33 1 ${40 + i}0 00 00 ${10 + i}`,
        photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&h=100",
        billingInfo: {
          address: `${i} Rue de la Paix`,
          city: "Paris",
          postalCode: `7500${i}`,
          country: "France",
        },
      });
      clients.push(client);
      console.log(`✅ Created client: ${client.companyName || client.email}`);
    }

    // Create 10 missions
    const categories = ["pets", "moving", "digital", "garden", "cleaning", "handyman"];
    const missionTemplates = [
      { title: "Promenade de chien", desc: "Besoin de quelqu'un pour promener mon Golden Retriever pendant 45min.", category: "pets", price: 15, duration: "45 mins" },
      { title: "Aide déménagement canapé", desc: "Besoin de deux personnes fortes pour descendre un canapé de 2 étages.", category: "moving", price: 30, duration: "1 heure" },
      { title: "Montage vidéo Instagram", desc: "J'ai des rushes, besoin d'un montage de 30s avec sous-titres.", category: "digital", price: 50, duration: "2 heures" },
      { title: "Ramassage de feuilles", desc: "Nettoyage du jardin, ramasser et mettre en sacs. Sacs fournis.", category: "garden", price: 25, duration: "2 heures" },
      { title: "Ménage appartement", desc: "Ménage complet d'un T2 (40m²). Produits fournis.", category: "cleaning", price: 40, duration: "2 heures" },
      { title: "Montage meuble IKEA", desc: "Assemblage d'un bureau Malm. Outils fournis.", category: "handyman", price: 35, duration: "1.5 heures" },
      { title: "Garde de chat", desc: "Nourrir et jouer avec mon chat pendant mon absence.", category: "pets", price: 20, duration: "30 mins" },
      { title: "Livraison de courses", desc: "Faire mes courses et les livrer à mon domicile.", category: "moving", price: 18, duration: "1 heure" },
      { title: "Retouche photo Photoshop", desc: "Retouches professionnelles sur 10 photos.", category: "digital", price: 45, duration: "3 heures" },
      { title: "Tonte de pelouse", desc: "Tondre une pelouse de 100m². Tondeuse fournie.", category: "garden", price: 30, duration: "1.5 heures" },
    ];

    const missions = [];
    for (let i = 0; i < 10; i++) {
      const template = missionTemplates[i];
      const mission = await storage.createMission({
        clientId: clients[i % 3].id,
        title: template.title,
        description: template.desc,
        category: template.category,
        estimatedDuration: template.duration,
        price: template.price,
        location: `Paris ${i + 1}ème`,
        locationLat: 48.8566 + (Math.random() * 0.1 - 0.05),
        locationLng: 2.3522 + (Math.random() * 0.1 - 0.05),
        isRemote: template.category === "digital",
        requiredSkills: [],
      });
      missions.push(mission);
      console.log(`✅ Created mission: ${mission.title}`);
    }

    // Assign 3 missions to workers
    for (let i = 0; i < 3; i++) {
      const assignment = await storage.createAssignment({
        missionId: missions[i].id,
        workerId: workers[i].id,
      });
      await storage.updateMissionStatus(missions[i].id, "assigned");
      console.log(`✅ Assigned mission "${missions[i].title}" to ${workers[i].firstName}`);
    }

    // Complete 2 missions
    for (let i = 0; i < 2; i++) {
      const assignment = await storage.getAssignment(missions[i].id);
      if (assignment) {
        await storage.completeAssignment(assignment.id);
        await storage.updateMissionStatus(missions[i].id, "completed");
        await storage.incrementCompletedMissions(workers[i].id);
        
        // Create payment for completed mission
        const platformFeeRate = 0.15; // 15%
        const amountToWorker = missions[i].price * (1 - platformFeeRate);
        const platformFee = missions[i].price * platformFeeRate;
        
        await storage.createPayment({
          missionId: missions[i].id,
          clientId: clients[i % 3].id,
          workerId: workers[i].id,
          amountTotal: missions[i].price,
          amountToWorker,
          platformFee,
          paymentProvider: "stripe",
          status: "released",
        });
        
        // Create rating
        await storage.createRating({
          missionId: missions[i].id,
          raterId: clients[i % 3].id,
          ratedUserId: workers[i].id,
          stars: 5,
          comment: "Excellent travail, rapide et soigné !",
        });
        
        // Update worker rating
        await storage.updateUserRating(workers[i].id, 4.8 + (i * 0.1));
        
        console.log(`✅ Completed mission "${missions[i].title}" with payment and rating`);
      }
    }

    console.log("✨ Database seeded successfully!");
    console.log("\n📧 Test credentials:");
    console.log("Worker: worker1@quicktask.com / password123");
    console.log("Client: client1@quicktask.com / password123");
    
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Run seed if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seed()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { seed };
