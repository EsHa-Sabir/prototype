/* =============================================================================
   THE HUMAN ARCHIVE — RECORD DATABASE (DOCUMENT-ALIGNED VERSION)

   Primary content source:
   Belge 1 — THE HUMAN ARCHIVE v2.0 Complete Script with Verified Sources

   Implementation/data-schema source:
   Belge 2 — THE HUMAN ARCHIVE Implementation Plan

   IMPORTANT
   - Uses the records.js example schema from Belge 2:
       id, chapter, title, template (A/B/C), nasaData, story, mechanic
   - Contains exactly the 11 records and the template assignments in both docs.
   - NASA DATA and STORY are deliberately separate.
   - The three Moon image filenames supplied with the current project manifest
     are mapped below; confirm the files exist and retain their original source URLs.
   - Other record images retain their documented image requirements until their
     exact filenames and source URLs are mapped.
   - Voyager's changing status/distance must be checked live before display.
   - Documentary source-label differences are recorded in sourceNotes.
   - The Elora XLSX referenced by Belge 2 was not included in the available files;
     source parity with that workbook is therefore still unverified.

   Current project runtime: classic browser script / vanilla JavaScript.
   Namespace: window.THA.records

   Recommended script order:
   <script src="js/data/records.js"></script>
   Then load map, template, and record-page scripts.
   ============================================================================= */

(function attachTHARecordDatabase(root) {
    "use strict";

    // -------------------------------------------------------------------------
    // Project-level counts and the documented archive unlock sequence.
    // The first nine records are Moon (3) + Mars (4) + Other Traces (2).
    // Hidden Records add two more records after those nine main records.
    // -------------------------------------------------------------------------
    const ARCHIVE_CONFIG = {
        project: "THE HUMAN ARCHIVE",
        totalRecordCount: 11,
        mainRecordCount: 9,
        hiddenRecordCount: 2,
        totalScreenGroups: 12,
        individualScreenCount: 19,
        finaleScreenCount: 1,
        initialAccessibleCount: 0,
        initialMainRecordTotal: 9,
        structuralCompletionAfterRecords: 99,
        userContributionPercent: 1,
        completionAfterUserContribution: 100,
        unlockSequence: ["moon", "mars", "other", "hidden", "yourArchive"],
        progressKeys: { moon: 3, mars: 4, other: 2, hidden: 2 }
    };

    // `chapter` uses the progress keys described in Belge 2. `section` aliases
    // are also exposed for compatibility with the earlier THA data helper.
    const CHAPTERS = [
        {
            id: "moon",
            sectionId: "moon",
            title: "MOON ARCHIVE",
            label: "MOON",
            route: "moonMap",
            order: 1,
            total: 3,
            world: "Moon",
            unlocksAfter: null,
            audioCue: {
                description: "Pure absolute silence punctuated by a low, synthesized electronic ping every 4 seconds.",
                silenceBetweenPings: true,
                pingIntervalMs: 4000,
                noAtmosphericWind: true
            },
            introduction: "Apollo 11 landed here in 1969. What stayed behind?",
            completionText: "Three records. All three unlocked. All three meaningful.",
            completionLabel: "MOON ARCHIVE COMPLETE",
            completionCount: "3 / 3"
        },
        {
            id: "mars",
            sectionId: "mars",
            title: "MARS ARCHIVE",
            label: "MARS",
            route: "marsMap",
            order: 2,
            total: 4,
            world: "Mars",
            unlocksAfter: { moon: 3 },
            audioCue: {
                description: "Continuous low-frequency ambient sound inspired by the Martian atmosphere.",
                provenanceRule: "If the ambient sound is an actual NASA recording, label it NASA DATA. If it is team-created sound design, label it TEAM INTERPRETATION.",
                suggestedSource: "NASA Perseverance rover acoustic recordings, only when an authentic recording is actually used"
            },
            introduction: "A red sphere appears. Mars. Craters. Dust. This time, there is sound. But it is not an actual recording. It is a low-frequency ambient sound inspired by the Martian atmosphere. Soft. Continuous. As if coming from far away.",
            completionText: "Four records. All four unlocked. We found the traces on Mars. But humanity traveled even farther.",
            completionLabel: "MARS ARCHIVE COMPLETE",
            completionCount: "4 / 4"
        },
        {
            id: "other",
            sectionId: "otherTraces",
            title: "OTHER TRACES",
            label: "OTHER TRACES",
            route: "otherTraces",
            order: 3,
            total: 2,
            world: "Deep Space",
            unlocksAfter: { moon: 3, mars: 4 },
            audioCue: {
                description: "Faint cosmic microwave background radiation static, shifting into clean Golden Record audio greetings as the timeline updates."
            },
            introduction: "Humanity did not go only to the Moon and Mars. It also sent a message from itself into the universe.",
            completionText: "Humanity did not leave only machines. It left a message from itself, too.",
            completionLabel: "OTHER TRACES COMPLETE",
            completionCount: "2 / 2"
        },
        {
            id: "hidden",
            sectionId: "hiddenRecords",
            title: "HIDDEN RECORDS",
            label: "HIDDEN RECORDS",
            route: "hiddenRecords",
            order: 4,
            total: 2,
            world: "Moon and Mars",
            unlocksAfter: { moon: 3, mars: 4, other: 2 },
            unlockRequirementText: "This section unlocks after the user completes the nine main records.",
            visualDirection: "A differently colored terminal box, such as dark blue or cyber-purple.",
            audioCue: "Deep, mysterious, curiosity-inducing harmonic drone.",
            introduction: "There are two more unidentified objects in the archive. They are not vehicles. But they are parts of a vehicle's story. Object identification mode is now starting.",
            completionText: "When we leave a spacecraft behind, do we really leave only the spacecraft? No. We leave what carried it. What landed it. What powered it. What protected it. Every mission leaves a trace behind.",
            completionLabel: "HIDDEN RECORDS COMPLETE",
            completionCount: "2 / 2"
        }
    ];

    const TEMPLATES = {
        A: {
            id: "A",
            label: "Template A",
            name: "Surface Map Explorer",
            purpose: "Displays a location on a map. The user clicks it, zooms in, and unlocks clues.",
            mechanics: [
                "Separate SVG maps for the Moon and Mars",
                "Clickable markers with CSS pulse animations",
                "Camera zoom using transform: scale and transitions",
                "Clue cards with accordion animations",
                "Object DNA cards with fade and slide animations"
            ],
            records: ["apollo-11", "laser-retroreflectors", "sojourner", "spirit"]
        },
        B: {
            id: "B",
            label: "Template B",
            name: "Chrono Slider",
            purpose: "The user moves along a timeline. Each stop reveals a piece of data.",
            mechanics: [
                "Range slider (HTML input range or custom slider)",
                "Timeline markers (SVG circles)",
                "Information popups at each point",
                "Opportunity SIGNAL LOST screen with 5 seconds of silence",
                "Ingenuity flight slider from 5 planned to 72 completed flights",
                "Voyager timeline slider from 1977 to today"
            ],
            records: ["opportunity", "ingenuity", "voyager-1", "pioneer-plaque"]
        },
        C: {
            id: "C",
            label: "Template C",
            name: "Mission Identity Analyzer",
            purpose: "The user is shown an object. Clues are revealed, the user makes a selection or guess, then the information/answer is revealed.",
            mechanics: [
                "Clue accordion",
                "Multiple-choice buttons",
                "Correct/incorrect feedback where appropriate",
                "Every Fallen Astronaut choice reveals information; there is no right or wrong answer",
                "Object DNA cards"
            ],
            records: ["fallen-astronaut", "sky-crane", "rtg"]
        }
    };

    // Build NASA DATA display fields from the flat key/value object while keeping
    // the flat keys required by the Implementation Plan's data example.
    function makeNASAData(data, labels) {
        const fields = labels.map(([key, label]) => ({
            label,
            value: data[key]
        })).filter((field) => field.value !== undefined && field.value !== null && field.value !== "");

        return Object.assign({}, data, { fields });
    }

    // All record image paths are project-relative. The three Moon records below
    // override the manifest filename/src with their verified included assets.
    const ASSET_DIRECTORY = "assets/images/";

    function makeMedia(assetKey, alt, requiredImage) {
        return {
            assetKey,
            directory: ASSET_DIRECTORY,
            filename: null,
            src: null,
            alt,
            requiredImage,
            assetStatus: "The team reports that the verified image has been collected; map its exact filename here.",
            note: "Set filename and src to the actual file in assets/images/. Do not rename or invent an asset path without checking the folder."
        };
    }

    const RECORDS = [
        // =====================================================================
        // MOON — Template A, A, C
        // =====================================================================
        {
            id: "apollo-11",
            legacyId: "apollo-11-descent-stage",
            chapter: "moon",
            section: "moon",
            number: 1,
            title: "Apollo 11 Descent Stage",
            screenTitle: "APOLLO 11 LUNAR MODULE DESCENT STAGE",
            template: "A",
            templateName: "Surface Map Explorer",
            priority: "critical",
            objectType: "Lunar Module descent stage",
            location: {
                world: "Moon",
                name: "Mare Tranquillitatis",
                display: "Mare Tranquillitatis, Moon",
                latitude: 0.67416,
                longitude: 23.47314,
                coordinateDisplay: "0.67416° N, 23.47314° E"
            },
            nasaData: makeNASAData({
                location: "Mare Tranquillitatis, Moon",
                landingDate: "July 20, 1969",
                coordinates: "0.67416° N, 23.47314° E",
                status: "Left on lunar surface; visible in NASA LRO images",
                type: "Lunar Module — Descent Stage",
                dryWeight: "4,483 lb (≈2,034 kg)",
                identifier: "1969-059D",
                source: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-059C",
                sourceName: "NSSDCA — Apollo 11"
            }, [
                ["location", "LOCATION"],
                ["landingDate", "LANDING DATE"],
                ["coordinates", "COORDINATES"],
                ["status", "STATUS"],
                ["type", "TYPE"],
                ["dryWeight", "DRY WEIGHT"],
                ["identifier", "IDENTIFIER"]
            ]),
            storyLead: "Humans landed on the Moon.\nA piece of their mission remained.\nOn purpose.\nBecause they had not gone there\nto bring everything back to Earth.",
            story: "Eagle’s descent stage stayed at Tranquility Base. It served as the launch platform while the ascent stage carried Armstrong and Aldrin back to lunar orbit. Its later fate is not confirmed.",
            verifiedSourceNote: "NASA NSSDCA — Apollo 11 Lunar Module / EASEP.",
            clues: [
                { order: 1, title: "MISSION PHOTOGRAPH", text: "Two astronauts. A flag. A lunar module. What stayed behind?" },
                { order: 2, title: "LANDING SITE", text: "Mare Tranquillitatis · The Moon · 0.67416° N, 23.47314° E." },
                { order: 3, title: "MISSION LOG", text: "Apollo 11 · 20 July 1969 · first crewed Moon landing." },
                { order: 4, title: "TWO-STAGE MODULE", text: "The Lunar Module had two stages. The descent stage landed on the Moon and remained there. The ascent stage carried the astronauts back into lunar orbit. The descent stage had a recorded dry weight of about 2,034 kg." }
            ],
            objectIdentification: {
                detectedLabel: "UNIDENTIFIED",
                identifiedLabel: "APOLLO 11 LUNAR MODULE DESCENT STAGE",
                revealAfterAllClues: true
            },
            mechanic: "map-clues",
            interaction: {
                type: "map-clues",
                markerLabel: "RECORD DETECTED: 1",
                initialStatus: "UNKNOWN",
                cameraZoomDurationMs: 2000,
                revealCluesOneByOne: true,
                clueCount: 4
            },
            media: Object.assign(makeMedia(
                "apollo-11-descent-stage",
                "Apollo 11 Lunar Module descent stage on the lunar surface",
                "LM descent stage photograph (LRO)"
            ), {
                filename: "apollo-11-lro-landing-site.webp",
                src: "assets/images/apollo-11-lro-landing-site.webp",
                assetStatus: "NASA LRO landing-site image; included in assets/images/."
            }),
            soundCue: "A single piano note. Brief. Then silence.",
            digitalNotes: [
                "The VIEW OFFICIAL SOURCE button opens the NASA NSSDCA page in a new tab.",
                "The card appears with a fade-and-slide animation."
            ]
        },
        {
            id: "laser-retroreflectors",
            legacyId: "laser-retroreflectors",
            chapter: "moon",
            section: "moon",
            number: 2,
            title: "Laser Retroreflectors",
            screenTitle: "LASER RETROREFLECTORS",
            template: "A",
            templateName: "Surface Map Explorer",
            priority: "critical",
            objectType: "Scientific instrument",
            location: {
                world: "Moon",
                name: "Apollo 11, Apollo 14, and Apollo 15 landing sites",
                display: "Apollo 11, 14, and 15 landing sites, Moon",
                sites: ["Apollo 11 landing site", "Apollo 14 landing site", "Apollo 15 landing site"]
            },
            nasaData: makeNASAData({
                type: "Scientific instrument",
                averageEarthMoonDistance: "~384,400 km",
                laserMeasurements: "Centimeter-level precision",
                currentUse: "Laser retroreflectors at the Apollo 11, 14, and 15 landing sites are still used by scientists for measurements.",
                sourceOrganization: "NASA / GSFC",
                sourceName: "NASA / GSFC",
                source: "https://science.nasa.gov/centers-and-facilities/goddard/nasa-laser-reflecting-instrument-makes-gps-satellite-more-accurate/",
                sourceStatus: "Marked verified in Belge 1"
            }, [
                ["type", "TYPE"],
                ["averageEarthMoonDistance", "AVERAGE EARTH–MOON DISTANCE"],
                ["laserMeasurements", "LASER MEASUREMENTS"],
                ["currentUse", "CURRENT USE"]
            ]),
            storyLead: "These were not abandoned. Some are still being used in scientific measurements today.",
            story: "Special arrays of tiny, high-tech mirror prisms left by the Apollo crews. Even though the missions ended decades ago, these mirrors are still actively used by scientists on Earth today! We bounce powerful lasers off them to calculate the exact distance to the Moon down to the centimeter.",
            verifiedSourceNote: "NASA / GSFC — Laser retroreflectors at the Apollo 11, 14, and 15 landing sites are still used by scientists for measurements.",
            clues: [
                { order: 1, title: "A TINY SIGNAL TARGET", text: "100 tiny prisms, waiting for a flash of light." },
                { order: 2, title: "MIRROR PRISMS", text: "It is an array of tiny, high-tech mirror prisms left by the Apollo crews. They reflect laser light back toward its source." },
                { order: 3, title: "THE TWO-WAY TRACE", text: "A laser pulse travels from Earth to the Moon. The reflected signal returns from the Moon to Earth." },
                { order: 4, title: "STILL ANSWERING", text: "Arrays at the Apollo 11, 14, and 15 landing sites are still used by scientists. The measurements can reach centimeter-level precision." }
            ],
            mechanic: "laser-simulation",
            interaction: {
                type: "laser-ranging-simulation",
                detectedLabel: "TYPE: SCIENTIFIC INSTRUMENT",
                startButtonLabel: "START SIMULATION",
                simulationIsRealMeasurement: false,
                disclaimer: "This is a simulation, not a real measurement.",
                requiredExplanation: "Scientists use this method to measure.",
                outbound: { color: "red", from: "Earth", to: "Moon", durationMs: 2000 },
                return: { color: "green", from: "Moon", to: "Earth", durationMs: 2000 },
                totalDurationMs: 4000
            },
            media: Object.assign(makeMedia(
                "laser-retroreflectors",
                "Apollo lunar laser retroreflector array",
                "LRRR photograph"
            ), {
                filename: "apollo-14-laser-retroreflector-closeup-as14-67-9386.webp",
                src: "assets/images/apollo-14-laser-retroreflector-closeup-as14-67-9386.webp",
                assetStatus: "JPL article carousel close-up photo (AS14-67-9386), NASA credit; separate clue image is lunar-laser-retroreflector-array.webp."
            }),
            soundCue: "One whirr as the red beam travels Earth to Moon; one click at reflection; the green return is silent. Then silence, long, then a single note after the record.",
            digitalNotes: [
                "Use an SVG animation.",
                "The red line travels Earth to Moon for 2 seconds; the green line returns Moon to Earth for 2 seconds.",
                "This is a simulation, not a real measurement. The message must be Scientists use this method to measure, not You measured it."
            ]
        },
        {
            id: "fallen-astronaut",
            legacyId: "fallen-astronaut",
            chapter: "moon",
            section: "moon",
            number: 3,
            title: "Fallen Astronaut",
            screenTitle: "FALLEN ASTRONAUT",
            template: "C",
            templateName: "Mission Identity Analyzer",
            priority: "important",
            objectType: "Aluminum memorial sculpture and plaque",
            location: {
                world: "Moon",
                name: "Hadley Rille, Apollo 15 site",
                display: "Hadley Rille, Apollo 15 site, Moon",
                latitude: 26.1322,
                longitude: 3.6339,
                coordinateDisplay: "26.1322° N, 3.6339° E"
            },
            nasaData: makeNASAData({
                location: "Hadley Rille, Apollo 15 site, Moon",
                year: "1971",
                object: "8.5 cm aluminum sculpture beside a plaque",
                purpose: "Memorial honoring 14 astronauts and cosmonauts who lost their lives in space exploration",
                sourceOrganization: "NASA — Apollo 15",
                sourceName: "NASA — Apollo 15",
                source: "https://science.nasa.gov/resource/memorial-to-fallen-astronauts-on-the-moon",
                sourceStatus: "Marked verified in Belge 1"
            }, [
                ["location", "LOCATION"],
                ["year", "YEAR"],
                ["object", "OBJECT"],
                ["purpose", "PURPOSE"]
            ]),
            storyLead: "Humans can leave a world behind. But they do not leave their memories behind.",
            story: "A tiny, 8.5 cm aluminum sculpture left gently in the lunar dust next to a plaque. Placed by the Apollo 15 crew, it acts as a permanent, peaceful memorial honoring the 14 pioneering astronauts and cosmonauts who lost their lives chasing space exploration.",
            verifiedSourceNote: "NASA Science — Memorial to Fallen Astronauts on the Moon.",
            sourceNotes: [
                "Belge 1's Section 0 verification table lists NASA History / ALSJ, while the record's NASA DATA card labels its source NASA — Apollo 15 and prints the NASA Science memorial URL. The record-specific card label and URL are preserved; the table attribution is retained here as a documentary note."
            ],
            clues: [
                { order: 1, title: "THE OBJECT", text: "A small figure, 8.5 cm tall, made of aluminum, with a plaque beside it." },
                { order: 2, title: "LOCATION DATA", text: "Hadley Rille. Apollo 15 site. 26.1322° N, 3.6339° E." },
                { order: 3, title: "MISSION YEAR", text: "1971." },
                { order: 4, title: "WHY IT WAS LEFT", text: "Left in memory of 14 astronauts and cosmonauts who lost their lives in the pursuit of space exploration." }
            ],
            mechanic: "reflection-choice",
            interaction: {
                type: "reflection-choice",
                question: "Why do humans leave memorials on another world?",
                choicesHaveCorrectAnswer: false,
                revealFactsAfterChoice: true,
                choices: [
                    { id: "remember", label: "TO REMEMBER", feedback: "You focused on the memorial's role in remembrance.", correct: null },
                    { id: "warn", label: "TO WARN", feedback: "You reflected on the risks of space exploration.", correct: null },
                    { id: "celebrate", label: "TO CELEBRATE", feedback: "You reflected on humanity's spirit of discovery.", correct: null }
                ],
                rule: "Whichever option the user chooses, the factual information is revealed. There is no right answer."
            },
            media: Object.assign(makeMedia(
                "fallen-astronaut",
                "Fallen Astronaut aluminum sculpture and plaque on the Moon",
                "Figure photograph"
            ), {
                filename: "fallen-astronaut-as15-88-11894.webp",
                src: "assets/images/fallen-astronaut-as15-88-11894.webp",
                assetStatus: "Included in assets/images/; credit NASA / JSC."
            }),
            soundCue: "A single, sustained piano note.",
            digitalNotes: ["Template C — Choice / Interpretation Modal.", "There is no correct or incorrect choice for Fallen Astronaut."]
        },

        // =====================================================================
        // MARS — Template A, A, B, B
        // =====================================================================
        {
            id: "sojourner",
            legacyId: "sojourner-rover",
            chapter: "mars",
            section: "mars",
            number: 4,
            title: "Sojourner Rover",
            screenTitle: "SOJOURNER",
            template: "A",
            templateName: "Surface Map Explorer",
            priority: "important",
            objectType: "Mars rover",
            location: {
                world: "Mars",
                name: "Mars Pathfinder landing site",
                display: "Mars Pathfinder landing site"
            },
            nasaData: makeNASAData({
                mission: "Mars Pathfinder",
                arrival: "July 4, 1997",
                operation: "83 sols",
                size: "30 cm (1 foot)",
                weight: "10.6 kg (23 pounds)",
                sourceOrganization: "NASA / JPL",
                sourceName: "NASA / JPL — Mars Pathfinder & Sojourner",
                source: "https://www.jpl.nasa.gov/missions/mars-pathfinder-sojourner-rover/",
                sourceStatus: "Marked verified in Belge 1",
                narrativeDistance: "100 meters"
            }, [
                ["mission", "MISSION"],
                ["arrival", "ARRIVAL"],
                ["operation", "OPERATION"],
                ["size", "SIZE"],
                ["weight", "WEIGHT"]
            ]),
            storyLead: "It was one of the first rovers to move across the Martian surface. Despite its small size, it was traveling across the surface of an entirely new world.",
            story: "Humanity's tiny, trailblazing Mars rover—only the size of a microwave oven! It was engineered to last just 7 days, but completely shocked the world by exploring for 83 sols (Martian days) and traveling 100 meters before falling silent.",
            verifiedSourceNote: "NASA Science — Mars Pathfinder (Sojourner size: 1 foot / 30 cm; weight: 23 pounds / 10.6 kg).",
            clues: [
                { order: 1, title: "TRACE 1", text: "One of the first successful rovers to travel across Mars." },
                { order: 2, title: "TRACE 2", text: "Part of the Mars Pathfinder mission." },
                { order: 3, title: "TRACE 3", text: "Operated for 83 sols." }
            ],
            mechanic: "map-traces",
            interaction: {
                type: "map-traces",
                markerLabel: "TRACE 1",
                revealTracesOneByOne: true,
                traceCount: 3,
                completionSound: "short wheel sound"
            },
            media: Object.assign(makeMedia(
                "sojourner-rover",
                "Sojourner rover on the Martian surface",
                "Rover + Mars surface"
            ), {
                filename: "sojourner-rover-mars-surface.webp",
                src: "assets/images/sojourner-rover-mars-surface.webp",
                assetStatus: "NASA/JPL PIA01122 image is included in assets/images/."
            }),
            soundCue: "A short wheel sound. Then the Martian ambient sound returns."
        },
        {
            id: "spirit",
            legacyId: "spirit-rover",
            chapter: "mars",
            section: "mars",
            number: 5,
            title: "Spirit Rover (MER-A)",
            screenTitle: "SPIRIT",
            template: "A",
            templateName: "Surface Map Explorer",
            priority: "important",
            objectType: "Mars Exploration Rover A",
            location: {
                world: "Mars",
                name: "Gusev Crater",
                display: "Gusev Crater, Mars",
                latitude: -14.5684,
                longitude: 175.4726,
                coordinateDisplay: "14.5684° S, 175.4726° E"
            },
            nasaData: makeNASAData({
                location: "Gusev Crater, Mars",
                coordinates: "14.5684° S, 175.4726° E",
                mission: "Mars Exploration Rover A (MER-A)",
                missionPeriod: "2004–2011",
                planned: "90 sols",
                actual: "2,210 sols",
                distance: "~7.73 km",
                missionEnd: "May 25, 2011",
                scientificResult: "Evidence of past water activity and hydrothermal processes",
                sourceOrganization: "NASA / JPL",
                sourceName: "NASA / JPL — MER-A / Spirit Mars Exploration Rover",
                source: "https://science.nasa.gov/mission/mer-spirit/",
                sourceStatus: "Marked verified in Belge 1",
                communicationNote: "The rover had been silent since 2010."
            }, [
                ["location", "LOCATION"],
                ["coordinates", "COORDINATES"],
                ["planned", "PLANNED"],
                ["actual", "ACTUAL"],
                ["distance", "DISTANCE"],
                ["missionEnd", "MISSION END"],
                ["scientificResult", "SCIENTIFIC RESULT"]
            ]),
            storyLead: "It was designed for 90 days. It lasted six years.",
            story: "A rugged robotic geologist that crossed 7.73 km of treacherous alien desert. Before it became permanently trapped in the deep sands, it discovered the first clear, definitive evidence that liquid water once actively flowed across the surface of Mars.",
            verifiedSourceNote: "NASA Science — Spirit Rover (Mission ended May 25, 2011. The rover had been silent since 2010. It found strong evidence of past water activity on Mars.)",
            clues: [],
            mechanic: "map-object-explorer",
            interaction: {
                type: "map-object-explorer",
                markerLabel: "TRACE 2",
                focus: "Evidence of past water activity and hydrothermal processes"
            },
            media: Object.assign(makeMedia(
                "spirit-rover",
                "Spirit Mars Exploration Rover at Gusev Crater",
                "Rover + Gusev Crater"
            ), {
                filename: "spirit-rover-gusev-crater.webp",
                src: "assets/images/spirit-rover-gusev-crater.webp",
                assetStatus: "NASA/JPL-Caltech/Cornell PIA04413 image is included in assets/images/."
            }),
            soundCue: "The ambient sound grows slightly melancholic. Then it fades away."
        },
        {
            id: "opportunity",
            legacyId: "opportunity-rover",
            chapter: "mars",
            section: "mars",
            number: 6,
            title: "Opportunity Rover (MER-B)",
            screenTitle: "OPPORTUNITY",
            template: "B",
            templateName: "Chrono Slider",
            priority: "critical",
            objectType: "Mars Exploration Rover B",
            location: {
                world: "Mars",
                name: "Meridiani Planum",
                display: "Meridiani Planum, Mars"
            },
            nasaData: makeNASAData({
                arrival: "January 25, 2004",
                arrivalSourceNote: "The verified source note gives January 24, 2004 PST; this corresponds to January 25, 2004 in the script's stated date.",
                planned: "90 sols",
                actual: "5,498 sols",
                lastContact: "June 10, 2018",
                missionEnd: "February 13, 2019",
                distance: "45.16 km",
                sourceOrganization: "NASA / JPL",
                sourceName: "NASA / JPL — MER-B / Opportunity Mars Exploration Rover",
                source: "https://science.nasa.gov/mission/mer-opportunity/",
                sourceStatus: "Marked verified in Belge 1"
            }, [
                ["arrival", "ARRIVAL"],
                ["planned", "PLANNED"],
                ["actual", "ACTUAL"],
                ["lastContact", "LAST CONTACT"],
                ["missionEnd", "MISSION END"],
                ["distance", "DISTANCE"]
            ]),
            storyLead: "Then it fell silent.",
            story: "The ultimate planetary distance runner. Built to survive for 90 days, it outlasted all expectations by operating for an unbelievable 5,498 sols and covering 45.16 km before a massive, planet-wide dust storm permanently blocked its solar power panels in 2018.",
            verifiedSourceNote: "NASA Science — Opportunity Rover (Arrival: January 24, 2004 PST. Last contact: June 10, 2018. Mission ended February 13, 2019. Distance: 45.16 km. Planned mission duration: 90 sols.)",
            clues: [],
            timeline: [
                { date: "2004", label: "Landing" },
                { date: "2005", label: "First rock examination" },
                { date: "2007", label: "Victoria Crater" },
                { date: "2010", label: "20 km traveled" },
                { date: "2014", label: "Endeavour Crater" },
                { date: "2018", label: "Dust storm" }
            ],
            mechanic: "timeline",
            interaction: {
                type: "chrono-slider-with-signal-loss",
                sliderStart: 2004,
                sliderEnd: 2018,
                timelineEvents: [
                    { year: 2004, label: "Landing" },
                    { year: 2005, label: "First rock examination" },
                    { year: 2007, label: "Victoria Crater" },
                    { year: 2010, label: "20 km traveled" },
                    { year: 2014, label: "Endeavour Crater" },
                    { year: 2018, label: "Dust storm" }
                ],
                stormSequence: "Ambient sound grows louder; show 2018 — A MASSIVE DUST STORM ON MARS; screen goes dark; ambient sound rises rapidly and cuts off abruptly.",
                signalLost: {
                    label: "SIGNAL LOST",
                    silenceDurationMs: 5000,
                    completeSilence: true,
                    suppressAmbientAudio: true,
                    suppressClicks: true,
                    suppressNotes: true
                },
                afterSilence: {
                    nasaData: ["Last contact: June 10, 2018", "Mission end: February 13, 2019"],
                    storyLead: "Then it fell silent."
                }
            },
            media: Object.assign(makeMedia(
                "opportunity-rover",
                "Opportunity rover with Martian terrain panorama",
                "Rover + panorama"
            ), {
                filename: "opportunity-rover-greeley-panorama.webp",
                src: "assets/images/opportunity-rover-greeley-panorama.webp",
                assetStatus: "NASA/JPL-Caltech/Cornell/Arizona State University PIA15689 image is included in assets/images/."
            }),
            soundCue: "Ambient sound → silence for 5 seconds → single long piano note. No wind, clicks, or notes during the 5-second SIGNAL LOST state."
        },
        {
            id: "ingenuity",
            legacyId: "ingenuity-helicopter",
            chapter: "mars",
            section: "mars",
            number: 7,
            title: "Ingenuity Helicopter",
            screenTitle: "INGENUITY",
            template: "B",
            templateName: "Chrono Slider",
            priority: "critical",
            objectType: "Mars helicopter / rotorcraft",
            location: {
                world: "Mars",
                name: "Jezero Crater",
                display: "Jezero Crater, Mars"
            },
            nasaData: makeNASAData({
                planned: "5 flights",
                completed: "72 flights",
                firstFlight: "April 19, 2021",
                finalFlight: "January 18, 2024",
                missionEnd: "January 25, 2024",
                sourceOrganization: "NASA / JPL Flight Log",
                sourceName: "NASA / JPL — Ingenuity 72-Flight Map",
                source: "https://www.jpl.nasa.gov/videos/see-ingenuitys-flight-map-72-helicopter-flights-on-mars/",
                sourceStatus: "Marked verified in Belge 1"
            }, [
                ["planned", "PLANNED"],
                ["completed", "COMPLETED"],
                ["firstFlight", "FIRST FLIGHT"],
                ["finalFlight", "FINAL FLIGHT"],
                ["missionEnd", "MISSION END"]
            ]),
            storyLead: "What did Ingenuity leave behind? Data. Design lessons. A path for future flying vehicles.",
            story: "The little rotorcraft that could. It became the first aircraft in history to achieve powered, controlled flight on another planet. Slated for only 5 short test flights, it soared through the thin Martian skies 72 times before a rotor blade sustained flight damage.",
            verifiedSourceNote: "NASA / JPL — Ingenuity Mars Helicopter (First flight: April 19, 2021. Final flight: January 18, 2024. Total: 72 flights. Mission ended January 25, 2024. Five test flights were originally planned.)",
            clues: [],
            timeline: [
                { date: "April 19, 2021", label: "First flight" },
                { date: "2021–2024", label: "72 completed flights", value: 72 },
                { date: "January 18, 2024", label: "Final flight" },
                { date: "January 25, 2024", label: "Mission ended" }
            ],
            mechanic: "flight-slider",
            interaction: {
                type: "flight-count-slider",
                plannedFlights: 5,
                minimum: 1,
                maximum: 72,
                initialValue: 1,
                finalValue: 72,
                showOneDotPerFlight: true,
                dotCountAtFinalValue: 72,
                finalState: "One of the rotor blades is damaged. The screen trembles slightly."
            },
            media: Object.assign(makeMedia(
                "ingenuity-helicopter",
                "Ingenuity Mars Helicopter and its flight path",
                "Helicopter + flight path"
            ), {
                filename: "ingenuity-mars-helicopter.webp",
                src: "assets/images/ingenuity-mars-helicopter.webp",
                assetStatus: "NASA/JPL-Caltech PIA23882 image is included in assets/images/."
            }),
            soundCue: "A brief whirr. Then a cracking/damage sound. Then silence."
        },

        // =====================================================================
        // OTHER TRACES — Template B, B
        // =====================================================================
        {
            id: "voyager-1",
            legacyId: "voyager-1",
            chapter: "other",
            section: "otherTraces",
            number: 8,
            title: "Voyager 1",
            screenTitle: "VOYAGER 1",
            template: "B",
            templateName: "Chrono Slider",
            priority: "important",
            objectType: "Interstellar space probe carrying the Golden Record",
            location: {
                world: "Deep Space",
                name: "Interstellar space",
                display: "Deep Interstellar space (over 25 billion kilometers away)"
            },
            nasaData: makeNASAData({
                launch: "September 5, 1977",
                location: "Interstellar space — beyond the heliopause",
                heliopause: "August 25, 2012",
                distanceMethod: "Runtime estimate derived from NASA/JPL's November 18, 2026 one-light-day milestone and reported spacecraft speed; not live telemetry.",
                sourceOrganization: "NASA / JPL",
                sourceName: "NASA / JPL — Voyager 1 Interstellar Mission",
                source: "https://www.jpl.nasa.gov/missions/voyager-1/",
                sourceStatus: "Mission status snapshot checked November 10, 2026; follow the live NASA/JPL page for later changes."
            }, [
                ["launch", "LAUNCH"],
                ["location", "LOCATION"],
                ["heliopause", "HELIOPAUSE CROSSING"],
                ["distanceMethod", "DISTANCE ESTIMATE METHOD"]
            ]),
            sourceNotes: [
                "Belge 1 explicitly says Voyager 1's current communication status and distance change over time and must be checked live against NASA/JPL sources. Do not present the November 2026 estimate as a permanent current value.",
                "Belge 1's VERIFIED SOURCE paragraph says Voyager 1 is currently communicating with Earth, but the same document says this current status must be checked live. The static story below therefore avoids hard-coding that time-sensitive sentence."
            ],
            storyLead: "Humanity tried to tell its story. No answer came. Not yet.",
            story: "The farthest human-made object in history. Having left the solar system in 2012, it carries a golden copper record packed with greetings in 55 languages, music, and pictures of our home planet.",
            sourceStoryText: "The farthest human-made object in history. Having left the solar system in 2012, it is still communicating with Earth right now! It carries a golden copper record packed with greetings in 55 languages, music, and pictures of our home planet.",
            liveStoryStatus: {
                required: true,
                template: "Current communication status: {communicationStatus}.",
                fetchBeforeDisplay: true
            },
            verifiedSourceNote: "NASA / JPL — Voyager. On November 18, 2026, Voyager 1 is expected to reach a distance of one light-day: approximately 25.9 billion km. This is a forecast in the document, not a permanent value.",
            clues: [],
            timeline: [
                { date: "1977", label: "Launch" },
                { date: "1979", label: "Jupiter" },
                { date: "1980", label: "Saturn" },
                { date: "1990", label: "Pale Blue Dot", sound: "silence" },
                { date: "2012", label: "Interstellar space" },
                { date: "TODAY", label: "Still in communication with Earth — check live before display", dynamic: true }
            ],
            relatedArtifact: {
                id: "golden-record",
                title: "Golden Record",
                nasaData: {
                    greetings: "55 languages",
                    music: "90 minutes",
                    images: "115 images",
                    sounds: "Sounds of Earth",
                    sourceOrganization: "NASA / JPL",
                    source: "https://www.jpl.nasa.gov/missions/voyager-1/"
                },
                story: "A golden copper record packed with greetings, music, pictures, and sounds from Earth.",
                sourceStoryText: "The farthest human-made object in history. Having left the solar system in 2012, it is still communicating with Earth right now! It carries a golden copper record packed with greetings in 55 languages, music, and pictures of our home planet.",
                sourceNote: "Belge 1 identifies NASA / JPL as the source for the Golden Record but does not print a separate URL beneath its VIEW OFFICIAL SOURCE label. The Voyager 1 JPL mission deep link above is the document's listed Voyager source; do not imply it is a separately supplied Golden Record deep link."
            },
            liveData: {
                required: true,
                refreshBeforeDisplay: true,
                fields: ["communicationStatus", "distanceKm"],
                doNotHardCode: true,
                note: "Current distance and communication status change over time and must be checked live against NASA/JPL sources.",
                futureMilestone: {
                    date: "2026-11-18",
                    label: "Expected one-light-day distance",
                    distanceKmApprox: 25900000000,
                    isForecast: true
                }
            },
            mechanic: "timeline",
            interaction: {
                type: "chrono-slider-with-live-endpoint",
                sliderStart: 1977,
                sliderEndLabel: "TODAY",
                currentEndpointMustBeLive: true,
                showGoldenRecordAfterTimeline: true,
                signalIntervalMs: 3000,
                specialTimelineEvent: "1990 — Pale Blue Dot — silence"
            },
            media: Object.assign(makeMedia(
                "voyager-1",
                "Voyager spacecraft with the Golden Record and its engraved cover",
                "Spacecraft + Golden Record"
            ), {
                filename: "voyager-spacecraft-golden-record.webp",
                src: "assets/images/voyager-spacecraft-golden-record.webp",
                credit: "NASA / JPL-Caltech",
                sourceUrl: "https://images.nasa.gov/details/PIA14113",
                sourceLabel: "NASA Image and Video Library — PIA14113",
                assetStatus: "Included WebP asset; NASA image PIA14113."
            }),
            soundCue: "A very faint signal every 3 seconds; a short musical passage when the Golden Record opens; then silence."
        },
        {
            id: "pioneer-plaque",
            legacyId: "pioneer-plaque",
            chapter: "other",
            section: "otherTraces",
            number: 9,
            title: "Pioneer Plaque",
            screenTitle: "PIONEER PLAQUE",
            template: "B",
            templateName: "Plaque Story",
            priority: "important",
            objectType: "Gold-anodized aluminum message plaque",
            location: {
                world: "Deep Space",
                name: "Attached to Pioneer 10 and Pioneer 11",
                display: "Pioneer 10 and Pioneer 11 spacecraft"
            },
            nasaData: makeNASAData({
                pioneer10Launch: "March 2, 1972",
                pioneer11Launch: "April 5, 1973",
                status: "Both Pioneer spacecraft are now silent",
                design: "Carl Sagan and Frank Drake; artwork by Linda Salzman Sagan",
                plaqueSize: "6 × 9 inches (about 15 × 23 cm)",
                material: "Gold-anodized aluminum",
                sourceOrganization: "NASA / NASA Ames Research Center",
                sourceName: "NASA — Pioneer Plaque",
                source: "https://science.nasa.gov/resource/pioneer-plaque/",
                sourceStatus: "Marked verified in Belge 1"
            }, [
                ["pioneer10Launch", "PIONEER 10 LAUNCH"],
                ["pioneer11Launch", "PIONEER 11 LAUNCH"],
                ["status", "STATUS"],
                ["design", "DESIGN"],
                ["plaqueSize", "PLAQUE SIZE"],
                ["material", "MATERIAL"]
            ]),
            story: "Gold-anodized metal sheets safely bolted to the outside of the old Pioneer spacecraft. Engraved with drawings of humans and a cosmic map pointing back to Earth—humanity's ultimate message in a bottle floating through the dark ocean of space.",
            verifiedSourceNote: "Smithsonian / NASA (Pioneer 10 launched March 2, 1972; Pioneer 11 launched April 5, 1973. The plaques were designed by Carl Sagan and Frank Drake. Each plaque is a 6 × 9-inch gold-anodized aluminum plate.)",
            clues: [],
            media: Object.assign(makeMedia(
                "pioneer-plaque",
                "Pioneer plaque artwork showing human figures, a pulsar map, and the Solar System diagram",
                "Detailed Pioneer Plaque artwork"
            ), {
                filename: "pioneer-plaque-artwork.webp",
                src: "assets/images/pioneer-plaque-artwork.webp",
                credit: "NASA / NASA Ames Research Center",
                sourceUrl: "https://science.nasa.gov/resource/pioneer-plaque/",
                sourceLabel: "NASA Science — Pioneer Plaque",
                assetStatus: "Included WebP asset; source page contains the detailed Pioneer plaque image."
            }),
            soundCue: "No added audio cue."
        },

        // =====================================================================
        // HIDDEN RECORDS — Template C, C
        // =====================================================================
        {
            id: "sky-crane",
            legacyId: "sky-crane",
            chapter: "hidden",
            section: "hiddenRecords",
            number: 10,
            title: "Sky Crane",
            screenTitle: "SKY CRANE — MARS LANDING SYSTEM",
            template: "C",
            templateName: "Mission Identity Analyzer",
            priority: "bonus",
            objectType: "Mars landing system",
            location: {
                world: "Mars",
                name: "Mars — Curiosity (2012) and Perseverance (2021) landing missions",
                display: "Mars"
            },
            nasaData: makeNASAData({
                missions: "Mars Science Laboratory (Curiosity, 2012) and Mars 2020 (Perseverance, 2021)",
                function: "Lowering a rover onto the Martian surface",
                status: "Mission complete. Left on Mars.",
                sourceOrganization: "NASA / JPL",
                sourceName: "NASA / JPL — Curiosity's Sky Crane",
                source: "https://www.jpl.nasa.gov/news/heres-how-curiositys-sky-crane-changed-the-way-nasa-explores-mars/",
                sourceStatus: "Marked verified in Belge 1"
            }, [
                ["missions", "MISSIONS"],
                ["function", "FUNCTION"],
                ["status", "STATUS"]
            ]),
            storyLead: "Not everything that travels to Mars comes back. The system that lowered the rover remained on the surface, too. Because it left a trace of its own. Not just the rover.",
            story: "A brilliant rocket-powered hover platform. It lowered the massive, car-sized rovers gently onto the Martian surface using long nylon cables so rocket exhaust wouldn't kick up destructive dust clouds. Once safe, it disconnected, flew away, and crashed on purpose.",
            verifiedSourceNote: "NASA / JPL — The Sky Crane was used during the Curiosity landing in 2012 and the Perseverance landing in 2021. It lowered the rovers using long nylon tethers. After landing, it deliberately crashed onto the surface.",
            clues: [
                { order: 1, title: "CLUE 1", text: "It was used on Mars." },
                { order: 2, title: "CLUE 2", text: "It never operated independently on the Martian surface." },
                { order: 3, title: "CLUE 3", text: "But it helped a rover reach the Martian surface." },
                { order: 4, title: "CLUE 4", text: "It was not a rover. It was the system that delivered one to Mars." }
            ],
            mechanic: "multiple-choice-identification",
            interaction: {
                type: "multiple-choice-identification",
                question: "WHAT IS IT?",
                acceptedAnswer: "landing-system",
                correctAnswer: "landing-system",
                choices: [
                    { id: "rover", label: "A ROVER", correct: false },
                    { id: "landing-system", label: "A LANDING SYSTEM", correct: true },
                    { id: "satellite", label: "A SATELLITE", correct: false },
                    { id: "scientific-instrument", label: "A SCIENTIFIC INSTRUMENT", correct: false }
                ],
                identifiedTitle: "SKY CRANE — MARS LANDING SYSTEM",
                revealCluesOneByOne: true
            },
            objectIdentification: {
                detected: { location: "MARS", type: "UNKNOWN" },
                identified: "SKY CRANE — MARS LANDING SYSTEM"
            },
            media: makeMedia(
                "sky-crane",
                "Mars Sky Crane landing system lowering a rover on tethers",
                "Landing system illustration"
            ),
            soundCue: "Hidden Records use a deep, curiosity-inducing hum / mysterious harmonic drone."
        },
        {
            id: "rtg",
            legacyId: "rtg-nuclear-power-source",
            chapter: "hidden",
            section: "hiddenRecords",
            number: 11,
            title: "RTG (Nuclear Battery)",
            screenTitle: "RADIOISOTOPE THERMOELECTRIC GENERATOR (RTG)",
            template: "C",
            templateName: "Mission Identity Analyzer",
            priority: "bonus",
            objectType: "Radioisotope Thermoelectric Generator",
            location: {
                world: "Moon",
                name: "Apollo Lunar Surface Experiments Package (ALSEP) deployment sites",
                display: "Moon — ALSEP experimental science station"
            },
            nasaData: makeNASAData({
                mission: "Apollo Lunar Surface Experiments Package (ALSEP)",
                function: "Providing power during the lunar night",
                power: "~70 watts",
                status: "Mission complete. On the Moon.",
                powerSource: "Heat from the radioactive decay of plutonium-238",
                usedOn: "Apollo 12, 14, 15, 16, and 17",
                sourceOrganization: "NASA / NSSDCA",
                sourceName: "NASA — Legacy Power Systems (SNAP-27) / ALSEP RTG",
                source: "https://science.nasa.gov/planetary-science/programs/radioisotope-power-systems/legacy-systems/",
                sourceStatus: "Marked verified in Belge 1"
            }, [
                ["mission", "MISSION"],
                ["function", "FUNCTION"],
                ["power", "POWER"],
                ["status", "STATUS"],
                ["powerSource", "POWER SOURCE"],
                ["usedOn", "USED ON"]
            ]),
            storyLead: "Night on the Moon lasts about 14 days. Solar panels cannot provide power without sunlight. So humans built a device. It contained a radioactive material. It produced heat. That heat was converted into electricity. This device helped experiments continue operating through the lunar night.",
            story: "Radioisotope Thermoelectric Generator. A safe battery that creates steady electricity using the natural heat radiating from safe, decaying atomic materials. It was crucial because it kept scientific tools warm and operating through brutal, freezing lunar nights that lasted 14 Earth days straight.",
            verifiedSourceNote: "NASA — ALSEP RTG (Provided approximately 70 watts using heat from the radioactive decay of plutonium-238. Used on Apollo 12, 14, 15, 16, and 17.)",
            clues: [
                { order: 1, title: "CLUE 1", text: "It was used on the Moon." },
                { order: 2, title: "CLUE 2", text: "An astronaut did not carry it away. An astronaut left it behind." },
                { order: 3, title: "CLUE 3", text: "It was not a solar panel. It was not a conventional battery." },
                { order: 4, title: "CLUE 4", text: "It could provide power without sunlight." },
                { order: 5, title: "CLUE 5", text: "It powered an experimental science station." }
            ],
            mechanic: "multiple-choice-identification",
            interaction: {
                type: "multiple-choice-identification",
                question: "WHAT IS IT?",
                acceptedAnswer: "nuclear-power-source",
                correctAnswer: "nuclear-power-source",
                choices: [
                    { id: "solar-panel", label: "A SOLAR PANEL", correct: false },
                    { id: "battery", label: "A BATTERY", correct: false },
                    { id: "nuclear-power-source", label: "A NUCLEAR POWER SOURCE", correct: true },
                    { id: "antenna", label: "AN ANTENNA", correct: false }
                ],
                identifiedTitle: "RADIOISOTOPE THERMOELECTRIC GENERATOR (RTG)",
                revealCluesOneByOne: true
            },
            objectIdentification: {
                detected: { location: "MOON", type: "UNKNOWN" },
                identified: "RADIOISOTOPE THERMOELECTRIC GENERATOR (RTG)"
            },
            media: makeMedia(
                "rtg-nuclear-power-source",
                "RTG power unit with cables and scientific equipment on the lunar surface",
                "RTG photograph"
            ),
            soundCue: "Hidden Records use a deep, curiosity-inducing hum; completion ends with a single, sustained piano note."
        }
    ];

    // -------------------------------------------------------------------------
    // Moon media/audio manifest.
    // Image paths are mapped to the embedded assets in Images.docx and their
    // image credits/source URLs are taken from images links.docx.
    // Audio filenames below were supplied by the project owner; this database
    // records the intended cue mapping while moon.js handles playback timing.
    // -------------------------------------------------------------------------
    const APPROVED_MOON_ASSET_MAP = {
        "apollo-11": {
            filename: "apollo-11-lro-landing-site.webp",
            src: "assets/images/apollo-11-lro-landing-site.webp",
            alt: "Annotated Lunar Reconnaissance Orbiter image of the Apollo 11 landing site, with the descent stage labelled.",
            credit: "NASA/Goddard Space Flight Center/Arizona State University",
            sourceUrl: "https://science.nasa.gov/resource/apollo-11-landing-site/",
            secondaryImages: [
                {
                    filename: "apollo-11-flag-aldrin-as11-40-5875.webp",
                    src: "assets/images/apollo-11-flag-aldrin-as11-40-5875.webp",
                    alt: "Apollo 11 astronaut Buzz Aldrin beside the United States flag, with the Lunar Module at left.",
                    credit: "NASA",
                    sourceUrl: "https://www.nasa.gov/image-article/explorers-on-the-moon-apollo-11-landing/"
                }
            ],
            assetStatus: "Embedded in Images.docx and matched to the documented NASA landing-site image; official image credit and source link are displayed in the Moon interface."
        },
        "laser-retroreflectors": {
            filename: "lunar-laser-retroreflector-array.webp",
            src: "assets/images/lunar-laser-retroreflector-array.webp",
            alt: "Apollo-era laser retroreflector array on the lunar surface.",
            credit: "NASA",
            sourceUrl: "https://www.nasa.gov/wp-content/uploads/2020/08/apollo_reflector.jpg",
            secondaryImages: [],
            assetStatus: "Mapped to the included lunar-laser-retroreflector-array.webp asset; source URL and credit follow images links.docx."
        },
        "fallen-astronaut": {
            filename: "fallen-astronaut-as15-88-11894.webp",
            src: "assets/images/fallen-astronaut-as15-88-11894.webp",
            alt: "Fallen Astronaut memorial figure and plaque on the lunar surface.",
            credit: "NASA / JSC",
            sourceUrl: "https://images.nasa.gov/details/as15-88-11894",
            secondaryImages: [],
            assetStatus: "Embedded in Images.docx; source URL and credit follow images links.docx."
        }
    };
    RECORDS.forEach((record) => {
        const mapped = APPROVED_MOON_ASSET_MAP[record.id];
        if (!mapped) return;
        Object.assign(record.media, mapped);
    });

    // User-supplied filenames for the Moon chapter's existing documented cues.
    const MOON_AUDIO_ASSETS = Object.freeze({
        chapterPing: "assets/audio/electronic-ping.mp3",
        laserWhirr: "assets/audio/laser-whirr.mp3",
        laserClick: "assets/audio/click.mp3",
        pianoNote: "assets/audio/single-piano-note.mp3"
    });
    CHAPTERS[0].audioCue.assetPath = MOON_AUDIO_ASSETS.chapterPing;
    CHAPTERS[0].audioCue.assetIntervalMs = 4000;
    {
        const apollo = RECORDS.find((record) => record.id === "apollo-11");
        const laser = RECORDS.find((record) => record.id === "laser-retroreflectors");
        const fallen = RECORDS.find((record) => record.id === "fallen-astronaut");
        if (apollo) apollo.audioAssets = { postRecordNote: MOON_AUDIO_ASSETS.pianoNote };
        if (laser) laser.audioAssets = {
            simulationWhirr: MOON_AUDIO_ASSETS.laserWhirr,
            simulationClick: MOON_AUDIO_ASSETS.laserClick,
            postRecordNote: MOON_AUDIO_ASSETS.pianoNote
        };
        if (fallen) fallen.audioAssets = { sustainedNote: MOON_AUDIO_ASSETS.pianoNote };
    }

    // These three general NASA homepage links were explicitly supplied by the
    // project team (via Irem) for Records 01, 03, and 04. They are preserved as
    // supplementary team verification links. The record-specific deep links
    // from Belge 1 remain the primary VIEW OFFICIAL SOURCE destinations.
    const TEAM_PROVIDED_GENERAL_VERIFICATION_URLS = {
        "apollo-11": "https://nasa.gov",
        "fallen-astronaut": "https://nasa.gov",
        "sojourner": "https://nasa.gov"
    };

    RECORDS.forEach((record) => {
        const links = [
            {
                kind: "documented-record-deep-link",
                label: "VIEW OFFICIAL SOURCE",
                url: record.nasaData.source
            }
        ];
        const teamUrl = TEAM_PROVIDED_GENERAL_VERIFICATION_URLS[record.id];
        if (teamUrl) {
            record.teamProvidedVerificationUrl = teamUrl;
            record.nasaData.teamProvidedVerificationUrl = teamUrl;
            links.push({
                kind: "team-provided-general-verification-link",
                label: "TEAM-PROVIDED NASA VERIFICATION LINK",
                url: teamUrl,
                note: "General NASA homepage supplied by the team; it is supplementary and is not a record-specific evidence page."
            });
        }
        record.verificationLinks = links;
    });

    // -------------------------------------------------------------------------
    // Defensive freezing and lookup indexes.
    // -------------------------------------------------------------------------
    function deepFreeze(value) {
        if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
        Object.freeze(value);
        Object.keys(value).forEach((key) => deepFreeze(value[key]));
        return value;
    }

    const RECORDS_BY_ID = Object.create(null);
    const RECORDS_BY_CHAPTER = Object.create(null);
    const RECORDS_BY_SECTION = Object.create(null);
    const RECORDS_BY_NUMBER = Object.create(null);

    ["moon", "mars", "other", "hidden"].forEach((key) => {
        RECORDS_BY_CHAPTER[key] = [];
    });
    ["moon", "mars", "otherTraces", "hiddenRecords"].forEach((key) => {
        RECORDS_BY_SECTION[key] = [];
    });

    const ID_ALIASES = {
        // Canonical concise IDs follow the Implementation Plan example and
        // Archive Assistant command names. Legacy IDs from the prior database
        // remain accepted so existing page code can migrate without breakage.
        "apollo-11-descent-stage": "apollo-11",
        "apollo11": "apollo-11",
        "laser": "laser-retroreflectors",
        "fallen": "fallen-astronaut",
        "sojourner-rover": "sojourner",
        "spirit-rover": "spirit",
        "opportunity-rover": "opportunity",
        "ingenuity-helicopter": "ingenuity",
        "voyager": "voyager-1",
        "pioneer": "pioneer-plaque",
        "rtg-nuclear-power-source": "rtg"
    };

    RECORDS.forEach((record) => {
        RECORDS_BY_ID[record.id] = record;
        RECORDS_BY_ID[record.legacyId] = record;
        RECORDS_BY_NUMBER[String(record.number)] = record;
        if (RECORDS_BY_CHAPTER[record.chapter]) RECORDS_BY_CHAPTER[record.chapter].push(record);
        if (RECORDS_BY_SECTION[record.section]) RECORDS_BY_SECTION[record.section].push(record);
    });

    Object.keys(RECORDS_BY_CHAPTER).forEach((key) => Object.freeze(RECORDS_BY_CHAPTER[key]));
    Object.keys(RECORDS_BY_SECTION).forEach((key) => Object.freeze(RECORDS_BY_SECTION[key]));
    deepFreeze(CHAPTERS);
    deepFreeze(TEMPLATES);
    deepFreeze(RECORDS);
    Object.freeze(RECORDS_BY_ID);
    Object.freeze(RECORDS_BY_NUMBER);
    Object.freeze(RECORDS_BY_CHAPTER);
    Object.freeze(RECORDS_BY_SECTION);

    function normalizeChapter(chapter) {
        if (chapter === "otherTraces") return "other";
        if (chapter === "hiddenRecords") return "hidden";
        return String(chapter || "");
    }

    function normalizeTemplate(template) {
        const value = String(template || "");
        if (value === "templateA") return "A";
        if (value === "templateB") return "B";
        if (value === "templateC") return "C";
        return value.toUpperCase();
    }

    function getRecord(id) {
        const key = String(id || "");
        const canonicalKey = ID_ALIASES[key] || key;
        return RECORDS_BY_ID[canonicalKey] || null;
    }

    function getRecordByNumber(number) {
        return RECORDS_BY_NUMBER[String(number)] || null;
    }

    function getChapter(chapterId) {
        const normalized = normalizeChapter(chapterId);
        return CHAPTERS.find((chapter) => chapter.id === normalized || chapter.sectionId === chapterId) || null;
    }

    function getRecordsByChapter(chapterId) {
        return RECORDS_BY_CHAPTER[normalizeChapter(chapterId)] || Object.freeze([]);
    }

    // Backwards-compatible name used in the earlier delivered records.js file.
    function getRecordsBySection(sectionId) {
        const key = sectionId === "other" ? "otherTraces" : sectionId === "hidden" ? "hiddenRecords" : sectionId;
        return RECORDS_BY_SECTION[key] || Object.freeze([]);
    }

    function getRecordsByTemplate(templateId) {
        const template = normalizeTemplate(templateId);
        return RECORDS.filter((record) => record.template === template);
    }

    function getNextRecord(id) {
        const record = getRecord(id);
        if (!record) return null;
        const index = RECORDS.findIndex((item) => item.id === record.id);
        return index >= 0 && index < RECORDS.length - 1 ? RECORDS[index + 1] : null;
    }

    function getPreviousRecord(id) {
        const record = getRecord(id);
        if (!record) return null;
        const index = RECORDS.findIndex((item) => item.id === record.id);
        return index > 0 ? RECORDS[index - 1] : null;
    }

    function getChapterTotals() {
        return Object.assign({}, ARCHIVE_CONFIG.progressKeys);
    }

    function getChapterCounts() {
        return CHAPTERS.reduce((counts, chapter) => {
            counts[chapter.id] = getRecordsByChapter(chapter.id).length;
            return counts;
        }, {});
    }

    // Backwards-compatible totals/counts with the prior section names.
    function getSectionTotals() {
        return {
            moon: 3,
            mars: 4,
            otherTraces: 2,
            hiddenRecords: 2
        };
    }

    function getSectionCounts() {
        return {
            moon: getRecordsBySection("moon").length,
            mars: getRecordsBySection("mars").length,
            otherTraces: getRecordsBySection("otherTraces").length,
            hiddenRecords: getRecordsBySection("hiddenRecords").length
        };
    }

    function getTemplateCounts() {
        return {
            A: getRecordsByTemplate("A").length,
            B: getRecordsByTemplate("B").length,
            C: getRecordsByTemplate("C").length
        };
    }

    function getImageManifest() {
        return RECORDS.map((record) => ({
            recordId: record.id,
            recordNumber: record.number,
            title: record.title,
            assetKey: record.media.assetKey,
            directory: record.media.directory,
            filename: record.media.filename,
            src: record.media.src,
            secondaryImages: record.media.secondaryImages || [],
            requiredImage: record.media.requiredImage,
            assetStatus: record.media.assetStatus
        }));
    }

    function validateDatabase() {
        const issues = [];
        const warnings = [];
        const seenIds = new Set();

        RECORDS.forEach((record) => {
            if (!record.id) issues.push("A record has no id.");
            if (seenIds.has(record.id)) issues.push(`Duplicate record id: ${record.id}`);
            seenIds.add(record.id);
            if (!record.chapter || !RECORDS_BY_CHAPTER[record.chapter]) issues.push(`${record.id} has an invalid chapter.`);
            if (!TEMPLATES[record.template]) issues.push(`${record.id} has an invalid template.`);
            if (!record.title) issues.push(`${record.id} has no title.`);
            if (!record.nasaData || !Array.isArray(record.nasaData.fields) || !record.nasaData.fields.length) {
                issues.push(`${record.id} has no NASA DATA display fields.`);
            }
            if (!record.nasaData?.source || !/^https:\/\//.test(record.nasaData.source)) {
                issues.push(`${record.id} has no official source URL.`);
            }
            if (!record.story || !record.mechanic) issues.push(`${record.id} must have STORY text and a mechanic.`);
            if (!record.media?.assetKey || !record.media?.requiredImage) issues.push(`${record.id} has no image asset requirement.`);
            if (record.media?.directory !== ASSET_DIRECTORY) issues.push(`${record.id} image directory must be ${ASSET_DIRECTORY}.`);
            if (!record.media?.src || !record.media?.filename) warnings.push(`${record.id}: exact image filename/path still needs to be mapped from assets/images/.`);
        });

        CHAPTERS.forEach((chapter) => {
            const count = getRecordsByChapter(chapter.id).length;
            if (count !== chapter.total) issues.push(`${chapter.id} has ${count} records; expected ${chapter.total}.`);
        });

        if (RECORDS.length !== ARCHIVE_CONFIG.totalRecordCount) {
            issues.push(`Database has ${RECORDS.length} records; expected ${ARCHIVE_CONFIG.totalRecordCount}.`);
        }
        if (getTemplateCounts().A !== 4 || getTemplateCounts().B !== 4 || getTemplateCounts().C !== 3) {
            issues.push("Template distribution must be A:4, B:4, C:3.");
        }
        if (getRecord("opportunity-rover")?.interaction?.signalLost?.silenceDurationMs !== 5000) {
            issues.push("Opportunity SIGNAL LOST must remain exactly 5 seconds.");
        }
        if (getRecord("laser-retroreflectors")?.interaction?.totalDurationMs !== 4000) {
            issues.push("Laser simulation must total 4 seconds (2 seconds out + 2 seconds back).");
        }
        if (getRecord("fallen-astronaut")?.interaction?.choicesHaveCorrectAnswer !== false) {
            issues.push("Fallen Astronaut must not have a correct/incorrect answer.");
        }
        if (getRecord("sky-crane")?.interaction?.choices?.length !== 4) {
            issues.push("Sky Crane must have four multiple-choice options.");
        }
        if (getRecord("rtg-nuclear-power-source")?.interaction?.choices?.length !== 4) {
            issues.push("RTG must have four multiple-choice options.");
        }
        if (!getRecord("voyager-1")?.liveData?.doNotHardCode) {
            issues.push("Voyager's current distance and communication status must be marked live.");
        }

        if (getRecord("apollo-11")?.nasaData?.identifier !== "1969-059D" || !getRecord("apollo-11")?.nasaData?.source?.endsWith("id=1969-059C")) {
            issues.push("Apollo 11 must identify the descent stage as 1969-059D and retain the supplied NSSDCA source page.");
        }
        if (getChapter("moon")?.audioCue?.pingIntervalMs !== 4000 || getChapter("moon")?.audioCue?.noAtmosphericWind !== true) {
            issues.push("Moon chapter audio must remain a low electronic ping every 4 seconds with no atmospheric wind.");
        }
        if (getRecord("apollo-11")?.interaction?.cameraZoomDurationMs !== 2000 || getRecord("apollo-11")?.clues?.length !== 4) {
            issues.push("Apollo 11 must use a 2-second zoom and reveal four clues one by one.");
        }
        if (getRecord("laser-retroreflectors")?.interaction?.outbound?.durationMs !== 2000 || getRecord("laser-retroreflectors")?.interaction?.return?.durationMs !== 2000) {
            issues.push("Laser simulation must animate Earth-to-Moon and Moon-to-Earth legs for 2 seconds each.");
        }
        if (getRecord("laser-retroreflectors")?.clues?.length !== 4) {
            issues.push("Laser Retroreflectors must use four sequential Template A clue cards.");
        }
        warnings.push("Moon WebP image paths were checked against the packaged assets/images/ folder; source links follow images links.docx.");
        warnings.push("Belge 2 identifies Elora's XLSX as the original data source. The workbook itself was not attached in the files available for this build, so direct cell-by-cell XLSX parity has not been independently re-audited here.");
        warnings.push("The three team-provided https://nasa.gov links are supplementary general verification links; the record-specific deep links from Belge 1 remain the primary source links.");
        warnings.push("All four Moon audio paths were checked against assets/audio/; the piano cue is delivered as a compressed 7-second MP3 for faster loading.");
        warnings.push("Voyager's current status/distance must be populated from a live NASA/JPL check at runtime.");

        return {
            valid: issues.length === 0,
            recordCount: RECORDS.length,
            chapterCounts: getChapterCounts(),
            templateCounts: getTemplateCounts(),
            issues,
            warnings
        };
    }

    const api = {
        version: "2.3.0-moon-template-a-laser-clues-audio",
        project: "THE HUMAN ARCHIVE",
        sourceDocuments: [
            "Belge 1 — THE HUMAN ARCHIVE v2.0 Complete Script with Verified Sources",
            "Belge 2 — THE HUMAN ARCHIVE Implementation Plan"
        ],
        schema: ["id", "chapter", "title", "template", "nasaData", "story", "mechanic"],
        archiveConfig: ARCHIVE_CONFIG,
        assetDirectory: ASSET_DIRECTORY,
        approvedMoonAssetMap: APPROVED_MOON_ASSET_MAP,
        moonAudioAssets: MOON_AUDIO_ASSETS,
        teamProvidedGeneralVerificationUrls: TEAM_PROVIDED_GENERAL_VERIFICATION_URLS,
        getImageManifest,
        chapters: CHAPTERS,
        sections: CHAPTERS,
        templates: TEMPLATES,
        all: RECORDS,
        byId: RECORDS_BY_ID,
        byChapter: RECORDS_BY_CHAPTER,
        bySection: RECORDS_BY_SECTION,
        getRecord,
        getRecordByNumber,
        getChapter,
        getRecordsByChapter,
        getRecordsBySection,
        getRecordsByTemplate,
        getNextRecord,
        getPreviousRecord,
        getChapterTotals,
        getChapterCounts,
        getSectionTotals,
        getSectionCounts,
        getTemplateCounts,
        validateDatabase
    };

    deepFreeze(ARCHIVE_CONFIG);
    deepFreeze(api);

    root.THA = root.THA || {};
    root.THA.records = api;
    root.THA_RECORDS = RECORDS;
    root.THA_RECORDS_BY_ID = RECORDS_BY_ID;

    if (typeof module !== "undefined" && module.exports) {
        module.exports = api;
    }

    const validation = validateDatabase();
    if (!validation.valid && root.console?.error) {
        root.console.error("THE HUMAN ARCHIVE: records.js validation failed.", validation.issues);
    }
})(typeof window !== "undefined" ? window : globalThis);
