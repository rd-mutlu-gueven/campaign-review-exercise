package exercise.campaign;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Component;

@Component
public class CampaignStore {
    public final Map<String, Campaign> campaigns = new ConcurrentHashMap<>();
    public final Map<String, LineItem> lineItems = new ConcurrentHashMap<>();

    public final Map<String, Coupon> coupons = new ConcurrentHashMap<>();

    public CampaignStore() {
        String[] titles = {"Fresh Milk", "Organic Apples", "Coffee Beans", "Pasta Selection", "Frozen Pizza",
                "Sparkling Water", "Chocolate Bar", "Basmati Rice", "Olive Oil", "Greek Yoghurt"};
        String[] types = {"PERCENT", "ABSOLUTE"};
        for (int i = 0; i < 40; i++) {
            Coupon k = new Coupon();
            k.id = "k-" + i;
            k.code = "COUPON-" + (1000 + i);
            k.title = titles[i % titles.length] + " " + (i / titles.length + 1);
            k.discountType = types[i % 2];
            k.discountValue = 5 + (i % 6) * 5;
            k.validUntil = "2026-12-31";
            k.internalMargin = 0.12 + (i % 5) / 100.0;
            k.supplierId = "sup-" + (i % 7);
            coupons.put(k.id, k);
        }

        seed("c-1", "Summer Fresh", "ACTIVE", "2026-06-01", "2026-08-31", 50000.0,
                List.of("NORTH", "SOUTH"), List.of("1001", "1002", "1003"));
        seed("c-2", "Back To School", "DRAFT", "2026-08-15", "2026-09-30", 12000.0,
                List.of("WEST"), List.of("2001"));
        seed("c-3", "Winter Warm-Up", "ARCHIVED", "2025-11-01", "2026-01-31", 30000.0,
                List.of("NORTH", "EAST"), List.of());
    }

    private void seed(String id, String name, String status, String from, String to, double budget,
                      List<String> regions, List<String> stores) {
        Campaign c = new Campaign();
        c.id = id;
        c.name = name;
        c.description = name + " promotional campaign";
        c.status = status;
        c.validFrom = from;
        c.validTo = to;
        c.budgetTotal = budget;
        c.salesRegions.addAll(regions);
        c.storeIds.addAll(stores);
        c.owner = "jane.doe@example.com";
        c.internalNotes = "do not expose";
        c.createdByUserId = "u-42";
        for (int i = 1; i <= 3; i++) {
            LineItem li = new LineItem();
            li.id = id + "-li-" + i;
            li.campaignId = id;
            li.couponRef = "COUPON-" + id + "-" + i;
            li.weighting = i * 10;
            li.allocation = budget * i / 10;
            li.internalCostCenter = "CC-" + i;
            lineItems.put(li.id, li);
            c.lineItemIds.add(li.id);
        }
        campaigns.put(id, c);
    }
}
