package exercise.campaign;

import java.util.ArrayList;
import java.util.List;

// Internal store model; also what the controller serializes.
public class Campaign {
    public String id;
    public String name;
    public String description;
    public String status;
    public String validFrom;
    public String validTo;
    public List<String> salesRegions = new ArrayList<>();
    public List<String> storeIds = new ArrayList<>();
    public double budgetTotal;
    public String owner;
    public String internalNotes;
    public String createdByUserId;
    public List<String> lineItemIds = new ArrayList<>();
}
