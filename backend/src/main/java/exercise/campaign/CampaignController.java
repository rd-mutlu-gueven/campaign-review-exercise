package exercise.campaign;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/campaign")
@CrossOrigin
public class CampaignController {

    @Autowired
    private CampaignStore store;

    @GetMapping("/list")
    public List<Campaign> list() {
        return new ArrayList<>(store.campaigns.values());
    }

    // header
    @GetMapping("/get")
    public Campaign get(@RequestParam String id) {
        return store.campaigns.get(id); // null -> 200 with empty body when unknown
    }

    // line items: FE stitches header + items + budget together
    @GetMapping("/lineItems")
    public List<LineItem> lineItems(@RequestParam String id) {
        Campaign c = store.campaigns.get(id);
        List<LineItem> result = new ArrayList<>();
        if (c == null) {
            return result;
        }
        for (String liId : c.lineItemIds) {
            result.add(store.lineItems.get(liId));
        }
        return result;
    }

    @GetMapping("/budget")
    public Map<String, Object> budget(@RequestParam String id) {
        Campaign c = store.campaigns.get(id);
        double allocated = 0;
        for (LineItem li : store.lineItems.values()) {
            if (li.campaignId.equals(id)) {
                allocated += li.allocation;
            }
        }
        System.out.println("budget for " + id + " allocated=" + allocated);
        return Map.of("total", c.budgetTotal, "allocated", allocated, "remaining", c.budgetTotal - allocated);
    }

    @PostMapping("/create")
    public Campaign create(@RequestBody Campaign c) {
        c.id = "c-" + (store.campaigns.size() + 1);
        if (c.status == null) {
            c.status = "DRAFT";
        }
        store.campaigns.put(c.id, c);
        return c; // 200, not 201
    }

    // full replace even to change one field
    @PutMapping("/update")
    public Object update(@RequestBody Campaign c) {
        try {
            if (c.status.equals("ACTIVE") && c.budgetTotal <= 0) {
                return "error: budget";
            }
            store.campaigns.put(c.id, c);
            return c;
        } catch (Exception e) {
            return null; // swallowed
        }
    }

    @PutMapping("/updateLineItem")
    public LineItem updateLineItem(@RequestBody LineItem li) {
        store.lineItems.put(li.id, li);
        return li;
    }

    // coupon search lives in the campaign controller; q is not validated, no paging, returns everything it finds
    @GetMapping("/searchCoupons")
    public List<Coupon> searchCoupons(@RequestParam String q) {
        List<Coupon> result = new ArrayList<>();
        for (Coupon k : store.coupons.values()) {
            if (k.title.contains(q) || k.code.contains(q)) {
                result.add(k);
            }
        }
        return result;
    }

    @GetMapping("/delete")
    public String delete(@RequestParam String id) {
        store.campaigns.remove(id);
        return "ok";
    }
}
