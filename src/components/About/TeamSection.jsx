import { motion } from "framer-motion";
// import { useSanity } from "../hooks/useSanity.js";
// import { TEAM_MEMBERS_QUERY } from "../lib/queries.js";

const AVATAR_COLORS = ["#ec4899", "#db2777", "#B8750A"];

const localTeam = [
  { name: "Kiruthika Santhoshni", role: "Founder & Head Baker", bio: "Kiruthika started NoviBakes out of her home kitchen in Salem with a simple belief — that every celebration deserves a cake made with real love. She leads every custom order personally." },
  { name: "Divya Priya", role: "Cake Design Specialist", bio: "Divya brings every customer's vision to life with intricate fondant art, floral designs, and themed creations. Her attention to detail makes each cake a centrepiece." },
  { name: "Nithya Lakshmi", role: "Packaging & Delivery", bio: "Nithya ensures every order reaches you picture-perfect — safely packed, on time, and presented exactly as you imagined. She handles all delivery coordination across Salem." },
];

function getInitials(name) {
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

const TeamSection = () => {
  // const { data: sanityData } = useSanity(TEAM_MEMBERS_QUERY, null);
  const team = localTeam;

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <h2 className="text-3xl font-bold text-slate-800 md:text-4xl mb-3">Meet Our Team</h2>
          <div className="h-1 w-20 rounded-full mx-auto mb-4" style={{ backgroundColor: "#ec4899" }} />
          <p className="mx-auto max-w-2xl text-slate-800">
            Behind every cake, pastry, and dessert is a dedicated team of talented bakers and designers committed to creating memorable experiences for every celebration.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ y: -8 }}
              className="group rounded-3xl border border-rose-50 bg-white p-8 text-center shadow-sm transition-all duration-300 hover:shadow-xl"
            >
              {member.image ? (
                <img
                  src={member.image}
                  alt={member.name}
                  className="mx-auto mb-6 h-32 w-32 rounded-full object-cover ring-4 ring-pink-100 group-hover:ring-amber-200 transition-all duration-300 shadow-md"
                />
              ) : (
                <div
                  className="mx-auto mb-6 h-32 w-32 rounded-full flex items-center justify-center ring-4 ring-pink-100 group-hover:ring-amber-200 transition-all duration-300 text-white text-3xl font-bold shadow-md"
                  style={{ backgroundColor: AVATAR_COLORS[index % AVATAR_COLORS.length] }}
                >
                  {getInitials(member.name)}
                </div>
              )}

              <h3 className="mb-2 text-xl font-bold text-slate-800">{member.name}</h3>
              <p className="mb-4 font-medium text-sm" style={{ color: "#ec4899" }}>{member.role}</p>
              <p className="text-sm leading-relaxed text-slate-800">{member.description ?? member.bio}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;