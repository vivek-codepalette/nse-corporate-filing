import { NextResponse } from 'next/server';
import { prisma } from '@/db/prisma';

const fetchStockData = async () => {
  const myHeaders = new Headers();
myHeaders.append("accept", "*/*");
myHeaders.append("accept-language", "en-US,en;q=0.9");
myHeaders.append("priority", "u=1, i");
myHeaders.append("referer", "https://www.nseindia.com/companies-listing/corporate-filings-actions");
myHeaders.append("sec-ch-ua", "\"Not(A:Brand\";v=\"99\", \"Google Chrome\";v=\"133\", \"Chromium\";v=\"133\"");
myHeaders.append("sec-ch-ua-mobile", "?0");
myHeaders.append("sec-ch-ua-platform", "\"macOS\"");
myHeaders.append("sec-fetch-dest", "empty");
myHeaders.append("sec-fetch-mode", "cors");
myHeaders.append("sec-fetch-site", "same-origin");
myHeaders.append("user-agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36");
myHeaders.append("Cookie", "_abck=73FD3F26B3556FFD694B5C9DC5ADA1D2~-1~YAAQB8gLF6lnSyWVAQAAhl0hMg1wLYYOiE469PE7T14hl6Uzi1mehQCPGoKjSLlP+VM4xos8uxwyyak5qrSqn6w8Xmv1sdNlRxmcWu+xW0Xi0vilKkRNEJtqH2iMeH1RRcFdDGN/5bDOoYFKC4xmg9tS3W2asqfWfEFwvF45DySh4i7EFz5rnsCiuAKW5hlY9NI3wU5pIz6tu0L1M7A3icQqhF9CKA1h7/XkpGtZzCXXJj6owM5k7yIjFfcVu1VjUICu6787L9eX0l40W9+InivkCOfzYIrc+rxk0K4crpUpl0lVuYwZtz1f3122JPw9jqFUqxPW7qWhgc5g0dvl4lkaB2rzRcca1HjNgfsdDvEK01IX4k6jJ2pmwob97FZrzfKS/3ddDSsZ/5rD+SjBUvWwMV8tXlaOlObPiQ==~-1~-1~-1; ak_bmsc=BDAE7801DE62B9182893CB1D06F2250F~000000000000000000000000000000~YAAQDcgLF+3RRiqVAQAAxOlNMhp2VKODntD3LjNVD66nUsy/Oale2pZEddm0iOk47IJVRmKzg/mePUVeYC3kl7CY/s72kpI6UhVCc7SffBCWueQohWr7jwSgRKVR8KkXeM4InU7sGsDChslmxB0zj9jB3+RslHTdMNZ55jf5Thzf/v8hny44K8n1D6Jzw/RIInTnf+TU4UPRwgnkl3kEqy+sOU7cx7sebTlhwDObuIPxxe+Z0xXwrBeyjnrvpldJ2lal1WKV3Sm9KGUpj32IUwKWH5Vl60uoCf9tK9dcak/jqIvc9BbSTddKeOKm10dDz0a4QUT+KJEu9yqfg/bapGdZfOdTsCK34wPFil/3eeefH4tT08AeHrpaYkUm3TAFA//CWwbfsD8mQv1XGOqCMO/Rj9ZKbSHdQh/z5r06DW7xhetC176nwZpsvWtEToNIxHbFsY4xcQ==; bm_mi=15815D285C18D8D6F39FB286A2BD4FD9~YAAQB8gLF645TCWVAQAA+V8zMhqVvD/fgj7JMsnzYh4TMCCqHLBthzyEPEsiU/Y73FAvz61JASCGgo+J31ooH7MgsMqcTJlRS+K+wOa0fTn21doJeubTYu5BJZ3cwJQ4I1Gc85Y//dBwMnnh7n9mqjPMGyPqI5XGfzZ+YdwE691u63LvJlXjA1K+YVe76tUfIpeASMz0A86HvqL/02TRRVwP7mS5kio+3TG83AySnwjRftQgzxIPmMioOVNaGKp/xOd9KZ5sM0Ddj21cv1HCR8GE3zVYiHr1ZCROWduB0KOp8aP9NmjkVa7a8pF8HSsMcNi0PVbujihPJSTUlgfFH3GseQvWY3j9X5bOWAJnoM5TpmnLxfS5Na0EZg==~1; bm_sv=C96E93F3082C205EBA6C2FCE5B54D5BD~YAAQB8gLF685TCWVAQAA+V8zMhqeEOCraRiEifleFzYleHITERIsmlgCX6lTv5nA3pwqNvZTEZhBCp8RA41tzdjFqaXCa/pxhKk9ZApid8uux6jsqVLYqXe+BpaRVPhPUz51m+poccaNcviGpMjbXpjUXAqaDveDwAKrMlOKHy29BSTuUq11O7mvWi9YTLDxWnwlIskYEKZKqvBOq5RVwZSIMkmyFW83V/mguqbg0XqhaMhZOowKOpFN9HCzeY24Y1o=~1; bm_sz=827909FBC3EAEAA2AA5B95FE26DDCF71~YAAQB8gLF6pnSyWVAQAAhl0hMhqj8V3yB8n1+m7vDxHhaaiHVwJCGUo4PREJLVA/oUl0E2moBxuNaGD5LSY/nwVuScty8Mk0qiBaeQG8/lwTuCaqknrwf3siB+Ub96nI4OTRi7K2wntVoEOi/Jujdh4QsNbWYzEEd+ZgEA8z4cKotdQ/6PE86MdQcbGzBj+WwbSJhtbM9aQeYM8WCwGZzAUEVWgupG1eZKZpaZH7FZJ1htutZIVkmgJAl8Dfi0sBRuG+YawxMtEPKa17mcSDkhvnHE6SQobzLgFPMIQFRPNpXtayFFEP5zKJeDbv1LL0tCuZrzb/Uv8HCyp4eR6SyIeod8nam4ISz/dQaDg=~3749955~3490867; nseappid=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJhcGkubnNlIiwiYXVkIjoiYXBpLm5zZSIsImlhdCI6MTc0MDMwODE5OCwiZXhwIjoxNzQwMzE1Mzk4fQ.t-4f5-_wxZc1vwLtnZma3t9txQoRSGXrFvCHSWBi5zk; nsit=x68kybQZzzdX0FD0qaeULf8z");

  const response = await fetch("https://www.nseindia.com/api/corporates-corporateActions?index=equities", {
    headers: myHeaders,
  redirect: "follow",
  method: "GET"
});

  const data = await response.json();
  return data;
};

export async function GET() {
  try {
    const records = await fetchStockData();

    if (records.length > 0) {
      
      const companyInfo = records.map((record: {
        symbol: string;
        comp: string;
        series: string;
        subject: string;
        faceVal: string;
        exDate: string;
        recordDate: string;
        bcStartDate: string;
        bcEndDate: string;
      }) => {
        const parseDate = (dateStr: string) => {
          if (!dateStr || dateStr === '-') return null;
          const [day, month, year] = dateStr.split('-');
          return new Date(`${year}-${month}-${day}`);
        };

        const data: {
          symbol: string;
          companyName: string;
          series: string;
          purpose: string;
          faceValue: number;
          exDate?: Date;
          recordDate?: Date;
          bookClosureStart?: Date;
          bookClosureEnd?: Date;
        } = {
          symbol: record.symbol,
          companyName: record.comp,
          series: record.series,
          purpose: record.subject,
          faceValue: parseFloat(record.faceVal) || 0,
        };

        const exDate = parseDate(record.exDate);
        if (exDate) {
          data.exDate = exDate;
        }

        const recordDate = parseDate(record.recordDate);
        if (recordDate) {
          data.recordDate = recordDate;
        }

        const bookClosureStart = parseDate(record.bcStartDate);
        if (bookClosureStart) {
          data.bookClosureStart = bookClosureStart;
        }

        const bookClosureEnd = parseDate(record.bcEndDate);
        if (bookClosureEnd) {
          data.bookClosureEnd = bookClosureEnd;
        }
        return data;
    });

      
      await prisma.companyInfo.createMany({
        data: companyInfo
      });
    }
    

    return NextResponse.json({ 
      success: true,
      recordCount: records
    });
  } catch (error) {
    console.error('Error in stocks API:', error);
    return NextResponse.json(
      { error: 'Failed to update stocks' }, 
      { status: 500 }
    );
  }
}