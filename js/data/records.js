
/*
 * THE HUMAN ARCHIVE
 * NASA Space Apps Challenge 2026
 *
 * Data source: Official project brief + NASA / JPL sources
 * Total records: 11
 *
 * Template A: Surface Map Explorer
 * Template B: Chrono Slider
 * Template C: Mission Identity Analyzer
 *
 * IMPORTANT:
 * Image paths are intentionally left as "assets/images/".
 * Replace these with your final image filenames later.
 */

const recordsData = {

  // =========================================================
  // 1. APOLLO 11 LUNAR MODULE DESCENT STAGE
  // Chapter: Moon | Template A
  // =========================================================

  apollo11: {
    id: "apollo11",
    title: "Apollo 11 Lunar Module Descent Stage",
    shortTitle: "Apollo 11",
    chapter: "moon",
    template: "A",

    image: "assets/images/",

    location: {
      name: "Mare Tranquillitatis",
      displayName: "Sea of Tranquility",
      body: "Moon",
      latitude: 0.67408,
      longitude: 23.47297,
      coordinatesLabel: "Approx. 0.674° N, 23.473° E"
    },

    introduction:
      "A part of the first crewed lunar landing mission remains on the Moon: the descent stage of the Apollo 11 Lunar Module.",

    clues: [
      "I carried astronauts toward the lunar surface.",
      "My mission helped make the first crewed Moon landing possible.",
      "The crew left my descent stage behind after leaving the lunar surface."
    ],

    nasaData: {
      landingDate: "July 20, 1969",
      mission: "Apollo 11",
      objectType: "Lunar Module descent stage",
      status: "Left on the lunar surface",
      purpose:
        "The descent stage helped the Lunar Module reach the Moon and supported the landing phase.",
      source:
        "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-059C"
    },

    facts: [
      {
        label: "Mission",
        value: "Apollo 11"
      },
      {
        label: "Landing date",
        value: "July 20, 1969"
      },
      {
        label: "Location",
        value: "Mare Tranquillitatis, Moon"
      },
      {
        label: "What remains",
        value: "Lunar Module descent stage"
      }
    ],

    story:
      "The descent stage was part of the machine that brought Neil Armstrong and Buzz Aldrin down to the lunar surface. After the astronauts departed in the ascent stage, the descent stage remained behind. It is a reminder that reaching a new world can leave a physical record of the journey.",

    sources: [
      {
        label: "NASA Space Science Data Coordinated Archive",
        url:
          "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-059C"
      }
    ]
  },


  // =========================================================
  // 2. LUNAR LASER RETROREFLECTORS
  // Chapter: Moon | Template A
  // =========================================================

  laser: {
    id: "laser",
    title: "Lunar Laser Retroreflectors",
    shortTitle: "Laser Reflectors",
    chapter: "moon",
    template: "A",

    image: "assets/images/",

    location: {
      name: "Apollo landing sites",
      displayName: "Moon — Apollo landing sites",
      body: "Moon",
      sites: [
        "Apollo 11 landing site",
        "Apollo 14 landing site",
        "Apollo 15 landing site"
      ],
      coordinatesLabel: "Multiple lunar locations"
    },

    introduction:
      "Small arrays left on the Moon allow scientists to measure the Earth–Moon distance using laser pulses.",

    clues: [
      "I do not need a battery to reflect a laser pulse.",
      "Scientists send laser pulses from Earth toward my arrays.",
      "My measurements help scientists study the Moon's orbit and motion."
    ],

    nasaData: {
      mission: "Apollo lunar missions",
      objectType: "Laser retroreflector arrays",
      status:
        "Reflectors remain on the Moon; lunar laser-ranging experiments have continued using them.",
      purpose:
        "To reflect laser pulses sent from Earth so scientists can measure the distance to the Moon with high precision.",
      importantNote:
        "The reflectors are passive devices. Their continued use does not mean they are powered or transmitting signals.",
      source:
        "https://science.nasa.gov/moon/"
    },

    facts: [
      {
        label: "Object",
        value: "Laser retroreflector arrays"
      },
      {
        label: "Location",
        value: "Several Apollo landing sites"
      },
      {
        label: "Power",
        value: "Passive — no onboard power required"
      },
      {
        label: "Scientific purpose",
        value: "Precise Earth–Moon distance measurements"
      }
    ],

    story:
      "These arrays are a special kind of remnant: they were not designed to send messages by themselves. Scientists on Earth send laser pulses toward the Moon and detect the returning light. The arrays have helped researchers measure the Earth–Moon distance and investigate the Moon's motion.",

    sources: [
      {
        label: "NASA Moon — mission and science information",
        url: "https://science.nasa.gov/moon/"
      }
    ]
  },


  // =========================================================
  // 3. FALLEN ASTRONAUT MEMORIAL
  // Chapter: Moon | Template C
  // =========================================================

  fallenAstronaut: {
    id: "fallenAstronaut",
    title: "Fallen Astronaut Memorial",
    shortTitle: "Fallen Astronaut",
    chapter: "moon",
    template: "C",

    image: "assets/images/",

    location: {
      name: "Hadley–Apennine landing site",
      displayName: "Apollo 15 landing site",
      body: "Moon",
      coordinatesLabel: "Apollo 15 — Hadley–Apennine region"
    },

    introduction:
      "A small memorial placed on the Moon honours astronauts and cosmonauts who died in the pursuit of space exploration.",

    clues: [
      "I am a memorial, not a scientific instrument.",
      "Apollo 15 astronauts left me on the lunar surface.",
      "A small figurine and a plaque make up this tribute."
    ],

    question:
      "What does the Fallen Astronaut Memorial commemorate?",

    options: [
      "The first human landing on Mars",
      "Astronauts and cosmonauts who died in the pursuit of space exploration",
      "The discovery of water on the Moon",
      "The end of the Apollo program"
    ],

    correctAnswer: 1,

    explanation:
      "The memorial was placed on the Moon by Apollo 15 astronauts David Scott and James Irwin. Its plaque lists 14 deceased astronauts and cosmonauts.",

    nasaData: {
      mission: "Apollo 15",
      placementDate: "August 2, 1971",
      objectType: "Memorial plaque and figurine",
      status: "Left on the lunar surface",
      location: "Hadley–Apennine landing site",
      purpose:
        "To honour 14 astronauts and cosmonauts who had died in the pursuit of space exploration.",
      source:
        "https://science.nasa.gov/resource/memorial-to-fallen-astronauts-on-the-moon/"
    },

    facts: [
      {
        label: "Mission",
        value: "Apollo 15"
      },
      {
        label: "Placement date",
        value: "August 2, 1971"
      },
      {
        label: "Honours",
        value: "14 astronauts and cosmonauts"
      },
      {
        label: "Location",
        value: "Hadley–Apennine, Moon"
      }
    ],

    story:
      "Not every object left in space was designed to collect scientific data. This small memorial carries a human story: exploration is a shared effort shaped by the people who take part in it and those who are remembered.",

    sources: [
      {
        label: "NASA — Memorial to Fallen Astronauts on the Moon",
        url:
          "https://science.nasa.gov/resource/memorial-to-fallen-astronauts-on-the-moon/"
      }
    ]
  },


  // =========================================================
  // 4. SOJOURNER ROVER
  // Chapter: Mars | Template A
  // =========================================================

  sojourner: {
    id: "sojourner",
    title: "Sojourner Rover",
    shortTitle: "Sojourner",
    chapter: "mars",
    template: "A",

    image: "assets/images/",

    location: {
      name: "Ares Vallis",
      displayName: "Ares Vallis, Mars",
      body: "Mars",
      coordinatesLabel: "Pathfinder landing region"
    },

    introduction:
      "Sojourner was a small robotic rover that explored the Martian surface during NASA's Mars Pathfinder mission.",

    clues: [
      "I was a small rover carried to Mars by the Pathfinder mission.",
      "I examined nearby rocks and soil.",
      "My mission helped demonstrate a new way to explore Mars with a rover."
    ],

    nasaData: {
      mission: "Mars Pathfinder",
      arrivalDate: "July 4, 1997",
      objectType: "Robotic rover",
      status: "Mission completed",
      plannedDuration: "7 sols for the Pathfinder primary mission",
      purpose:
        "To investigate rocks and soil near the landing site and demonstrate rover technology.",
      size:
        "About 65 cm long; verify the exact dimension before displaying it as a definitive fact.",
      source:
        "https://science.nasa.gov/mission/mars-pathfinder/"
    },

    facts: [
      {
        label: "Mission",
        value: "Mars Pathfinder"
      },
      {
        label: "Mars arrival",
        value: "July 4, 1997"
      },
      {
        label: "Object",
        value: "Small robotic rover"
      },
      {
        label: "Location",
        value: "Ares Vallis, Mars"
      }
    ],

    story:
      "Sojourner helped show that a rover could travel around a landing site and examine nearby rocks. Its work supported later generations of Mars rovers and helped make mobile robotic exploration a practical part of planetary science.",

    sources: [
      {
        label: "NASA Science — Mars Pathfinder",
        url: "https://science.nasa.gov/mission/mars-pathfinder/"
      }
    ]
  },


  // =========================================================
  // 5. SPIRIT ROVER
  // Chapter: Mars | Template A
  // =========================================================

  spirit: {
    id: "spirit",
    title: "Spirit Rover (MER-A)",
    shortTitle: "Spirit",
    chapter: "mars",
    template: "A",

    image: "assets/images/",

    location: {
      name: "Gusev Crater",
      displayName: "Gusev Crater, Mars",
      body: "Mars",
      coordinatesLabel: "Gusev Crater"
    },

    introduction:
      "Spirit explored Mars for years beyond its original planned mission, investigating rocks and signs of past water.",

    clues: [
      "My original mission was planned for about 90 Martian sols.",
      "I operated for years longer than planned.",
      "My last communication was received in March 2010."
    ],

    nasaData: {
      mission: "Mars Exploration Rover — Spirit (MER-A)",
      launchDate: "June 10, 2003",
      landingDate: "January 4, 2004",
      lastCommunication: "March 22, 2010",
      contactAttemptsEnded: "May 25, 2011",
      objectType: "Robotic rover",
      status: "Mission declared complete",
      plannedDuration: "90 sols",
      actualDuration: "More than six Earth years of operations",
      distanceTravelled: "Approximately 7.73 km",
      purpose:
        "To investigate Martian rocks and soil for evidence of past water activity.",
      source: "https://science.nasa.gov/mission/mer-spirit/"
    },

    facts: [
      {
        label: "Mission",
        value: "Mars Exploration Rover — Spirit"
      },
      {
        label: "Landing date",
        value: "January 4, 2004"
      },
      {
        label: "Last communication",
        value: "March 22, 2010"
      },
      {
        label: "Mission declared complete",
        value: "May 25, 2011"
      },
      {
        label: "Distance travelled",
        value: "Approximately 7.73 km"
      }
    ],

    story:
      "Spirit was designed for a short mission but continued working for years. It became stuck in soft soil and eventually stopped communicating. NASA continued trying to contact the rover before declaring the mission complete in 2011. Today, Spirit remains on Mars as a reminder of how far a robotic explorer can go beyond its original design.",

    sources: [
      {
        label: "NASA Science — Spirit",
        url: "https://science.nasa.gov/mission/mer-spirit/"
      }
    ]
  },


  // =========================================================
  // 6. OPPORTUNITY ROVER
  // Chapter: Mars | Template B
  // =========================================================

  opportunity: {
    id: "opportunity",
    title: "Opportunity Rover (MER-B)",
    shortTitle: "Opportunity",
    chapter: "mars",
    template: "B",

    image: "assets/images/",

    location: {
      name: "Meridiani Planum",
      displayName: "Meridiani Planum, Mars",
      body: "Mars",
      coordinatesLabel: "Meridiani Planum"
    },

    introduction:
      "Opportunity was designed for a 90-sol mission but continued exploring Mars for almost 15 Earth years.",

    clues: [
      "My planned mission lasted about 90 Martian sols.",
      "I travelled more than 45 kilometres across Mars.",
      "A global dust storm eventually prevented my solar-powered mission from continuing."
    ],

    timeline: [
      {
        date: "January 25, 2004",
        title: "Mars landing",
        description:
          "Opportunity landed in Meridiani Planum."
      },
      {
        date: "2005",
        title: "Rock examination",
        description:
          "The rover continued examining Martian rocks and soil for clues about the planet's past."
      },
      {
        date: "August 2011",
        title: "Endeavour Crater",
        description:
          "Opportunity reached the rim of Endeavour Crater."
      },
      {
        date: "June 2018",
        title: "Dust storm and lost contact",
        description:
          "A major dust storm reduced sunlight reaching the rover's solar panels. The last signal was received on June 10, 2018."
      },
      {
        date: "February 13, 2019",
        title: "Mission ends",
        description:
          "NASA announced the end of the Opportunity mission after communication-recovery efforts failed."
      }
    ],

    nasaData: {
      mission: "Mars Exploration Rover — Opportunity (MER-B)",
      landingDate: "January 25, 2004",
      lastCommunication: "June 10, 2018",
      missionEnd: "February 13, 2019",
      objectType: "Robotic rover",
      status: "Mission completed",
      plannedDuration: "90 sols",
      actualDuration: "5,111 sols",
      distanceTravelled: "Approximately 45.16 km",
      purpose:
        "To investigate Martian rocks and soil and search for geological evidence of past water.",
      source: "https://science.nasa.gov/mission/mer-opportunity/"
    },

    facts: [
      {
        label: "Landing date",
        value: "January 25, 2004"
      },
      {
        label: "Planned mission",
        value: "90 sols"
      },
      {
        label: "Distance travelled",
        value: "Approximately 45.16 km"
      },
      {
        label: "Last communication",
        value: "June 10, 2018"
      },
      {
        label: "Mission end",
        value: "February 13, 2019"
      }
    ],

    story:
      "Opportunity turned a planned three-month mission into an extraordinary journey lasting almost 15 Earth years. It explored the Martian surface, examined rocks and travelled across a landscape shaped by ancient geological processes. A dust storm eventually blocked enough sunlight that the rover could no longer continue its solar-powered work.",

    sources: [
      {
        label: "NASA Science — Opportunity",
        url: "https://science.nasa.gov/mission/mer-opportunity/"
      }
    ]
  },


  // =========================================================
  // 7. INGENUITY MARS HELICOPTER
  // Chapter: Mars | Template B
  // =========================================================

  ingenuity: {
    id: "ingenuity",
    title: "Ingenuity Mars Helicopter",
    shortTitle: "Ingenuity",
    chapter: "mars",
    template: "B",

    image: "assets/images/",

    location: {
      name: "Jezero Crater",
      displayName: "Jezero Crater, Mars",
      body: "Mars",
      coordinatesLabel: "Jezero Crater"
    },

    introduction:
      "Ingenuity began as a technology demonstration designed for a handful of flights. It went on to complete 72 flights on Mars.",

    clues: [
      "I travelled to Mars attached beneath the Perseverance rover.",
      "My first flight was the first powered, controlled flight on another planet.",
      "I completed 72 flights before my mission ended."
    ],

    timeline: [
      {
        date: "April 19, 2021",
        title: "First powered flight",
        description:
          "Ingenuity completed the first powered, controlled flight on another planet."
      },
      {
        date: "2021–2023",
        title: "Technology demonstration expands",
        description:
          "After its initial demonstration, Ingenuity continued flying to demonstrate aerial scouting capabilities."
      },
      {
        date: "January 18, 2024",
        title: "Final flight",
        description:
          "Ingenuity completed its 72nd and final flight."
      },
      {
        date: "January 25, 2024",
        title: "Mission ends",
        description:
          "NASA announced the end of the mission after flight damage made further flying impossible."
      }
    ],

    nasaData: {
      mission: "Mars 2020 / Perseverance",
      firstFlight: "April 19, 2021",
      finalFlight: "January 18, 2024",
      missionEnd: "January 25, 2024",
      objectType: "Robotic helicopter",
      status: "Flight mission ended; helicopter remains on Mars",
      plannedFlights: 5,
      completedFlights: 72,
      location: "Jezero Crater, Mars",
      purpose:
        "To demonstrate that powered, controlled flight was possible in the thin atmosphere of Mars.",
      source:
        "https://science.nasa.gov/mission/mars-2020-perseverance/ingenuity-mars-helicopter/"
    },

    facts: [
      {
        label: "First flight",
        value: "April 19, 2021"
      },
      {
        label: "Planned flights",
        value: "Up to 5"
      },
      {
        label: "Completed flights",
        value: "72"
      },
      {
        label: "Final flight",
        value: "January 18, 2024"
      },
      {
        label: "Mission ended",
        value: "January 25, 2024"
      }
    ],

    story:
      "Ingenuity was not designed to be a long-running aircraft. It was a technology demonstration meant to test whether powered flight could work in Mars' thin atmosphere. After its planned demonstration succeeded, it completed many more flights and helped show how aerial exploration might support future missions.",

    sources: [
      {
        label: "NASA Science — Ingenuity Mars Helicopter",
        url:
          "https://science.nasa.gov/mission/mars-2020-perseverance/ingenuity-mars-helicopter/"
      },
      {
        label: "NASA — Ingenuity mission ends",
        url:
          "https://www.nasa.gov/news-release/after-three-years-on-mars-nasas-ingenuity-mars-helicopter-mission-ends/"
      }
    ]
  },


  // =========================================================
  // 8. VOYAGER 1
  // Chapter: Other Traces | Template B
  // =========================================================

  voyager: {
    id: "voyager",
    title: "Voyager 1",
    shortTitle: "Voyager 1",
    chapter: "otherTraces",
    template: "B",

    image: "assets/images/",

    location: {
      name: "Interstellar space",
      displayName: "Beyond the heliosphere",
      body: "Interstellar space",
      coordinatesLabel: "A changing distance from the Sun and Earth"
    },

    introduction:
      "Voyager 1 is a long-running NASA spacecraft that crossed the heliopause and began exploring the interstellar environment.",

    clues: [
      "I launched in 1977.",
      "I crossed the heliopause in 2012.",
      "I carry a golden record intended to communicate information about Earth."
    ],

    timeline: [
      {
        date: "September 5, 1977",
        title: "Launch",
        description:
          "Voyager 1 began its journey from Earth."
      },
      {
        date: "December 2004",
        title: "Termination shock",
        description:
          "Voyager 1 reached the termination shock and entered the heliosheath."
      },
      {
        date: "August 25, 2012",
        title: "Interstellar space",
        description:
          "Voyager 1 crossed the heliopause and began measuring the interstellar environment."
      }
    ],

    nasaData: {
      launchDate: "September 5, 1977",
      heliopauseCrossing: "August 25, 2012",
      objectType: "Interstellar space probe",
      status:
        "Continuing its journey; NASA has reported that the spacecraft continues to communicate, although operating instruments and power are managed over time.",
      purpose:
        "To study the outer Solar System and the environment beyond the heliosphere.",
      notableFeature:
        "Carries the Voyager Golden Record, a message containing sounds, music, greetings and images from Earth.",
      source: "https://science.nasa.gov/mission/voyager/voyager-1/"
    },

    facts: [
      {
        label: "Launch date",
        value: "September 5, 1977"
      },
      {
        label: "Heliopause crossing",
        value: "August 25, 2012"
      },
      {
        label: "Destination region",
        value: "Interstellar space"
      },
      {
        label: "Message carried",
        value: "Voyager Golden Record"
      }
    ],

    story:
      "Voyager 1 is not an abandoned, silent object: it has continued to send scientific information from beyond the heliosphere. Its Golden Record also carries a message from humanity. It connects a scientific mission with a question that reaches beyond engineering: how might someone, somewhere, learn about Earth?",

    sources: [
      {
        label: "NASA Science — Voyager 1",
        url: "https://science.nasa.gov/mission/voyager/voyager-1/"
      },
      {
        label: "NASA Science — Interstellar Mission",
        url:
          "https://science.nasa.gov/mission/voyager/interstellar-mission/"
      }
    ]
  },


  // =========================================================
  // 9. PIONEER PLAQUE
  // Chapter: Other Traces | Template B
  // =========================================================

  pioneer: {
    id: "pioneer",
    title: "Pioneer Plaque",
    shortTitle: "Pioneer Plaque",
    chapter: "otherTraces",
    template: "B",

    image: "assets/images/",

    location: {
      name: "Deep space",
      displayName: "Pioneer spacecraft trajectories",
      body: "Solar System / interstellar trajectories",
      coordinatesLabel: "Travelling with Pioneer 10 and Pioneer 11"
    },

    introduction:
      "The Pioneer spacecraft carried plaques designed to communicate basic information about humanity to anyone who might find them.",

    clues: [
      "I travelled aboard Pioneer 10 and Pioneer 11.",
      "My design includes a diagram of human figures and symbols.",
      "I was created as a message for a possible future finder."
    ],

    timeline: [
      {
        date: "March 2, 1972",
        title: "Pioneer 10 launches",
        description:
          "Pioneer 10 began its journey toward Jupiter."
      },
      {
        date: "April 5, 1973",
        title: "Pioneer 11 launches",
        description:
          "Pioneer 11 launched carrying a similar plaque."
      },
      {
        date: "January 2003",
        title: "Pioneer 10 last signal",
        description:
          "Earth received Pioneer 10's last signal."
      }
    ],

    nasaData: {
      missions: ["Pioneer 10", "Pioneer 11"],
      launchDates: {
        pioneer10: "March 2, 1972",
        pioneer11: "April 5, 1973"
      },
      objectType: "Engraved metal plaque carried by spacecraft",
      status:
        "The plaques continue travelling with the spacecraft. Pioneer 10 and Pioneer 11 no longer provide routine communication.",
      creators:
        "Carl Sagan and Frank Drake contributed to the plaque concept and design.",
      purpose:
        "To provide a symbolic message about humanity and the origin of the spacecraft to a possible future finder.",
      source: "https://science.nasa.gov/resource/pioneer-plaque/"
    },

    facts: [
      {
        label: "Spacecraft",
        value: "Pioneer 10 and Pioneer 11"
      },
      {
        label: "Pioneer 10 launch",
        value: "March 2, 1972"
      },
      {
        label: "Pioneer 11 launch",
        value: "April 5, 1973"
      },
      {
        label: "Message",
        value: "A symbolic introduction to humanity"
      }
    ],

    story:
      "The Pioneer plaques were designed to travel farther than the missions' immediate scientific goals. They carry symbols intended to show where the spacecraft came from and what their makers looked like. The message is small, but its ambition is enormous: to leave a record of humanity beyond Earth.",

    sources: [
      {
        label: "NASA Science — Pioneer Plaque",
        url: "https://science.nasa.gov/resource/pioneer-plaque/"
      },
      {
        label: "NASA Science — Pioneer 10",
        url: "https://science.nasa.gov/mission/pioneer-10/"
      }
    ]
  },


  // =========================================================
  // 10. SKY CRANE DESCENT SYSTEM
  // Chapter: Hidden Records | Template C
  // =========================================================

  skyCrane: {
    id: "skyCrane",
    title: "Sky Crane Descent System",
    shortTitle: "Sky Crane",
    chapter: "hiddenRecords",
    template: "C",

    image: "assets/images/",

    location: {
      name: "Mars landing sites",
      displayName: "Curiosity and Perseverance landing sites",
      body: "Mars",
      coordinatesLabel: "Gale Crater and Jezero Crater"
    },

    introduction:
      "The Sky Crane landing system lowered large rovers toward the Martian surface using cables before separating and flying away.",

    clues: [
      "I helped deliver a rover safely to the Martian surface.",
      "I lowered the rover on cables during the final landing sequence.",
      "After the rover was on the ground, my descent stage moved away from it."
    ],

    question:
      "What was the Sky Crane system designed to do?",

    options: [
      "Carry astronauts back to Earth",
      "Lower a rover onto the Martian surface during landing",
      "Drill deep into the centre of Mars",
      "Fly the rover between planets"
    ],

    correctAnswer: 1,

    explanation:
      "The Sky Crane manoeuvre used a powered descent stage and bridles to lower the rover during the final part of landing. The descent stage then flew away from the rover.",

    nasaData: {
      missions: ["Curiosity", "Perseverance"],
      objectType: "Powered descent and rover-lowering system",
      status:
        "The descent stages completed their landing tasks and were not recovered for reuse.",
      purpose:
        "To deliver large rovers to the Martian surface with a controlled landing sequence.",
      source:
        "https://science.nasa.gov/mission/msl-curiosity/"
    },

    facts: [
      {
        label: "Used for",
        value: "Curiosity and Perseverance landings"
      },
      {
        label: "Location",
        value: "Mars"
      },
      {
        label: "Main job",
        value: "Lower the rover during landing"
      },
      {
        label: "After landing",
        value: "Descent stage separates and moves away"
      }
    ],

    story:
      "A rover landing does not end when its wheels touch the ground. The Sky Crane system had to complete its own final manoeuvre after lowering the rover. The descent stage was a temporary part of the mission: essential during landing, but not designed to remain attached to the rover afterward.",

    sources: [
      {
        label: "NASA Science — Curiosity",
        url: "https://science.nasa.gov/mission/msl-curiosity/"
      },
      {
        label: "NASA Science — Mars 2020 Perseverance",
        url: "https://science.nasa.gov/mission/mars-2020-perseverance/"
      }
    ]
  },


  // =========================================================
  // 11. RADIOISOTOPE THERMOELECTRIC GENERATOR (RTG)
  // Chapter: Hidden Records | Template C
  // =========================================================

  rtg: {
    id: "rtg",
    title: "Radioisotope Thermoelectric Generator",
    shortTitle: "Lunar RTG",
    chapter: "hiddenRecords",
    template: "C",

    image: "assets/images/",

    location: {
      name: "Apollo lunar experiment sites",
      displayName: "Moon — Apollo ALSEP sites",
      body: "Moon",
      coordinatesLabel: "Several Apollo lunar landing sites"
    },

    introduction:
      "A radioisotope thermoelectric generator converted heat from radioactive decay into electricity for lunar scientific instruments.",

    clues: [
      "I generated electricity from heat produced by radioactive decay.",
      "I powered lunar experiment packages deployed by several Apollo missions.",
      "My scientific instruments were shut down decades ago, but the equipment remains part of lunar history."
    ],

    question:
      "What was the purpose of the SNAP-27 RTG used with Apollo lunar experiments?",

    options: [
      "To provide electrical power to the lunar experiment package",
      "To launch the Lunar Module from the Moon",
      "To transmit television images directly to Mars",
      "To provide oxygen for astronauts"
    ],

    correctAnswer: 0,

    explanation:
      "The SNAP-27 RTG supplied electrical power to Apollo Lunar Surface Experiment Package (ALSEP) instruments. NASA lists an initial output of about 70 watts electric.",

    nasaData: {
      mission: "Apollo Lunar Surface Experiment Packages (ALSEP)",
      objectType: "SNAP-27 radioisotope thermoelectric generator",
      status:
        "ALSEP stations were shut down in 1977. The equipment remains on the Moon.",
      powerOutputAtStart: "About 70 watts electric",
      fuel: "Plutonium-238",
      usedOnMissions: [
        "Apollo 12",
        "Apollo 14",
        "Apollo 15",
        "Apollo 16",
        "Apollo 17"
      ],
      purpose:
        "To supply electrical power to scientific instruments in the Apollo lunar experiment packages.",
      source:
        "https://science.nasa.gov/planetary-science/programs/radioisotope-power-systems/power-radioisotope-thermoelectric-generators/"
    },

    facts: [
      {
        label: "System",
        value: "SNAP-27 RTG"
      },
      {
        label: "Fuel",
        value: "Plutonium-238"
      },
      {
        label: "Initial electrical output",
        value: "About 70 watts"
      },
      {
        label: "Used on",
        value: "Apollo 12, 14, 15, 16 and 17"
      },
      {
        label: "ALSEP shutdown",
        value: "1977"
      }
    ],

    story:
      "Scientific instruments need power even in a place where ordinary conditions are difficult. The SNAP-27 RTG converted heat from radioactive decay into electricity, allowing Apollo experiment packages to operate on the Moon. These systems were used on Apollo missions 12, 14, 15, 16 and 17—not Apollo 11.",

    sources: [
      {
        label: "NASA Science — Radioisotope Thermoelectric Generators",
        url:
          "https://science.nasa.gov/planetary-science/programs/radioisotope-power-systems/power-radioisotope-thermoelectric-generators/"
      }
    ]
  }

};


// =========================================================
// OPTIONAL DATA CHECK
// Run in the browser console to confirm all 11 records exist.
// =========================================================

function validateRecordsData() {
  const recordIds = Object.keys(recordsData);

  const expectedIds = [
    "apollo11",
    "laser",
    "fallenAstronaut",
    "sojourner",
    "spirit",
    "opportunity",
    "ingenuity",
    "voyager",
    "pioneer",
    "skyCrane",
    "rtg"
  ];

  const missingIds = expectedIds.filter(
    id => !Object.prototype.hasOwnProperty.call(recordsData, id)
  );

  const invalidRecords = recordIds.filter(id => {
    const record = recordsData[id];

    return (
      !record.id ||
      !record.title ||
      !record.chapter ||
      !["A", "B", "C"].includes(record.template) ||
      !record.location ||
      !record.nasaData ||
      !Array.isArray(record.clues) ||
      !record.image
    );
  });

  return {
    totalRecords: recordIds.length,
    expectedRecords: expectedIds.length,
    missingIds,
    invalidRecords,
    passed:
      recordIds.length === expectedIds.length &&
      missingIds.length === 0 &&
      invalidRecords.length === 0
  };
}
