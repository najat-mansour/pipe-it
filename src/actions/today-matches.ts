import { apiConfig } from "../config.js";

const importantLeagues = [
    39,  // Premier League
    45,  // FA Cup (England Cup 1)
    47,  // FA Trophy (England Cup 2)
    528, // Community Shield

    140, // La Liga
    143, // Copa del Rey (Spain Cup)
    556, // Super Cup (Spain Super Cup)

    135, // Serie A
    137, // Coppa Italia (Italy Cup)
    547, // Super Cup (Italy Super Cup)

    78,  // Bundesliga
    81,  // DFB Pokal
    529, // Super Cup (Germany Super Cup)

    61,  // French Ligue 1
    66,  // Coupe de France (France Cup)
    526, // Trophée des Champions (France Super Cup)

    2,   // UEFA Champions League
    3,   // UEFA Europa League
    531, // UEFA Super Cup

    1,   // World Cup
    4,   // Euro Championship
    5,   // UEFA Nations League
    7,   // Asian Cup
    6,	 // Africa Cup of Nations
    9,   // Copa America
    860, // Arab Cup

    30,  // World Cup - Qualification Asia
    29,  // World Cup - Qualification Africa
    32,  // World Cup - Qualification Europe
    34,  // World Cup - Qualification South America

    35,  // Asian Cup - Qualification
    36,  // Africa Cup of Nations - Qualification
    960, // Euro Championship - Qualification
];

type InputMatchFormat = {
    fixture: {
        referee: string;
        venue: {
            name: string;
            city: string;
        },
        status: {
            long: string;
            elapsed: number | null;
            extra: number | null;
        }
    },
    league: {
        id: number;
        name: string;
        country: string;
        round: string;
    },
    teams: {
        home: {
            name: string;
            logo: string;
        },
        away: {
            name: string;
            logo: string;
        }
    },
    goals: {
        home: number;
        away: number;
    },
    score: {
        penalty: {
            home: number | null;
            away: number | null;
        }
    }
};

type OutputMatchFormat = {
    league: {
        name: string;
        country: string;
        round: string;
    },
    venue: {
        name: string;
        city: string;
    },
    teams: {
        home: {
            name: string;
            logo: string;
            goals: number;
            penalty: number | null;
        },
        away: {
            name: string;
            logo: string;
            goals: number;
            penalty: number | null;
        }
    },
    status: {
        long: string;
        elapsed: number | null;
        extra: number | null;
    }
    referee: string;
};

function convert(input: InputMatchFormat): OutputMatchFormat {
    return {
        league: {
            name: input.league.name,
            country: input.league.country,
            round: input.league.round
        },
        venue: {
            name: input.fixture.venue.name,
            city: input.fixture.venue.city
        },
        teams: {
            home: {
                name: input.teams.home.name,
                logo: input.teams.home.logo,
                goals: input.goals.home,
                penalty: input.score.penalty.home
            },
            away: {
                name: input.teams.away.name,
                logo: input.teams.away.logo,
                goals: input.goals.away,
                penalty: input.score.penalty.away
            },
        },
        status: {
            long: input.fixture.status.long,
            elapsed: input.fixture.status.elapsed,
            extra: input.fixture.status.extra
        },
        referee: input.fixture.referee
    };
}

export async function getTodayMatches(): Promise<OutputMatchFormat[]> {
    const URL = "https://v3.football.api-sports.io/fixtures";
    const currentDate = new Date().toISOString().split("T")[0];
    const response = await fetch(`${URL}?date=${currentDate}`, {
        method: "GET",
        mode: "cors",
        headers: {
            "x-apisports-key": apiConfig.externalApisKeys.apiFootball
        }
    });
    const body = await response.json();
    const matches = body.response;
    const filteredMatches = matches.filter((match: InputMatchFormat) => importantLeagues.includes(match.league.id));
    const mappedFilteredMatches = filteredMatches.map((match: InputMatchFormat) => convert(match));
    return mappedFilteredMatches;
}