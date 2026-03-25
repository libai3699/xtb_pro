export interface IpGeoInfo {
  countryName?: string;
  regionName?: string;
  cityName?: string;
  orgName?: string;
  locationText?: string;
}

function isPrivateIp(ip: string) {
  return (
    ip === '127.0.0.1' ||
    ip === '::1' ||
    ip.startsWith('10.') ||
    ip.startsWith('192.168.') ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(ip)
  );
}

export async function resolveIpGeo(ip?: string): Promise<IpGeoInfo> {
  if (!ip) {
    return {};
  }

  if (isPrivateIp(ip)) {
    return {
      locationText: '内网IP/本地调试',
    };
  }

  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      return {};
    }

    const data = (await response.json()) as {
      country_name?: string;
      region?: string;
      city?: string;
      org?: string;
      error?: boolean;
    };

    if (data.error) {
      return {};
    }

    const locationParts = [data.country_name, data.region, data.city, data.org].filter(Boolean);

    return {
      countryName: data.country_name,
      regionName: data.region,
      cityName: data.city,
      orgName: data.org,
      locationText: locationParts.join(' / '),
    };
  } catch {
    return {};
  }
}

